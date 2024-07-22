const pool = require('../config/dbConfig');
const FastPriorityQueue = require('fastpriorityqueue');

// Toutes les fonctions utiles pour le calcul de l'itinéraire et la récupération des données

function calcule_temps(km, km_tunnel, vmax, ecluses, coef, nb_pontlevis, coef_ecluses) {
  const DEFAULT_VMAX = 10;
  const DEFAULT_COEF = 1;
  const DEFAULT_COEF_ECLUSES = 4;

  vmax = (vmax > 0 && vmax <= 50) ? vmax : DEFAULT_VMAX;
  coef = (coef > 0 && coef <= 50) ? coef : DEFAULT_COEF;
  coef_ecluses = (coef_ecluses > 0 && coef_ecluses <= 50) ? coef_ecluses : DEFAULT_COEF_ECLUSES;

  return ((km - km_tunnel) / (vmax * coef)) + (km_tunnel * 0.20) + (nb_pontlevis / 6) + (ecluses / coef_ecluses);
}

async function getCanalInfo(voieId) {
  const [rows] = await pool.query(`
    SELECT LIBELLE, DISTANCE, NBECLUSE, TIREAU, TIRAIR, LONGUEUR, LARGEUR, DESCRIPTIF 
    FROM voienav 
    WHERE CLE = ?
  `, [voieId]);
  return rows[0];
}

async function getPortsVoies(portId) {
  const [rows] = await pool.query(`
    SELECT PortVoie_VoieId, PortVoie_Pk 
    FROM mappyfluvial_ports_voies 
    WHERE PortVoie_PortId = ?
  `, [portId]);
  return rows;
}

async function getTronconInfo(tronconId) {
  const [rows] = await pool.query(`
    SELECT Troncon_Port1Id, Troncon_Port2Id, Troncon_Tunnel, Troncon_Vmax, Troncon_Ecluses, 
           Troncon_TirantEau, Troncon_TirantAir, Troncon_Longueur, Troncon_Largeur, Troncon_CoefVitesse, 
           Troncon_Temps, Troncon_NbPontLevis, Troncon_Ecluses_Coefficient 
    FROM mappyfluvial_troncons 
    WHERE Troncon_Id = ?
  `, [tronconId]);
  return rows[0];
}

async function getLocksByTronconId(tronconId) {
  const [rows] = await pool.query(`
    SELECT Ecluse_Id, Ecluse_Nom, Ecluse_MapX, Ecluse_MapY 
    FROM mappyfluvial_ecluses 
    WHERE Ecluse_TronconId = ?
  `, [tronconId]);
  return rows;
}

async function getPontsLevisByTronconId(tronconId) {
  const [rows] = await pool.query(`
    SELECT Pontlevis_Id, Pontlevis_Nom, Pontlevis_MapX, Pontlevis_MapY 
    FROM mappyfluvial_pontlevis 
    WHERE Pontlevis_TronconId = ?
  `, [tronconId]);
  return rows;
}

async function getLoueursByPortId(portId) {
  const [rows] = await pool.query(`
    SELECT CLE, SOCIETE 
    FROM mappyfluvial_ports_loueurs 
    LEFT JOIN loueur_adr ON PortLoueur_LoueurId=CLE 
    WHERE PortLoueur_PortId = ?
  `, [portId]);
  return rows;
}

async function getChantiersByPortId(portId) {
  const [rows] = await pool.query(`
    SELECT NOM, CLE 
    FROM mappyfluvial_ports_chantiers 
    LEFT JOIN chantier_adr ON PortChantier_ChantierId=CLE 
    WHERE PortChantier_PortId = ?
  `, [portId]);
  return rows;
}

async function getTronconPathsGoogle(tronconIds) {
  const [rows] = await pool.query(`
    SELECT Element_TronconId, Element_Latitude lat, Element_Longitude lng 
    FROM mappyfluvial_elements_googlemaps 
    WHERE Element_TronconId IN (?)
    ORDER BY Element_TronconId, Element_Id ASC
  `, [tronconIds]);
  return rows;
}

async function dijkstra(data, startId, endId, weightFunc) {
  const weight = {};
  const previous = {};
  const queue = new FastPriorityQueue((a, b) => weight[a] < weight[b]);

  data.ports.forEach(port => {
    weight[port.Port_Id] = Infinity;
  });
  weight[startId] = 0;

  queue.add(startId);

  while (!queue.isEmpty()) {
    const currentId = queue.poll();
    if (currentId === endId) break;

    const neighbors = data.troncons.filter(troncon =>
      troncon.Troncon_Port1Id === currentId || troncon.Troncon_Port2Id === currentId);
    for (const troncon of neighbors) {
      const neighborId = troncon.Troncon_Port1Id === currentId ? troncon.Troncon_Port2Id : troncon.Troncon_Port1Id;
      const alt = weight[currentId] + await weightFunc(troncon);
      if (alt < weight[neighborId]) {
        weight[neighborId] = alt;
        previous[neighborId] = currentId;
        queue.add(neighborId);
      }
    }
  }

  const path = [];
  let u = endId;
  while (previous[u] !== undefined) {
    path.unshift(u);
    u = previous[u];
  }
  if (u === startId) path.unshift(u);
  if (path[0] !== startId) return null;
  return { path, weight: weight[endId] };
}

function calculateTronconKm(port1_pk, port2_pk) {
  return port1_pk && port2_pk ? Math.abs(port1_pk - port2_pk) : 0;
}

function aggregatePortsVoies(portsVoies) {
  const tab = {};
  portsVoies.forEach(pv => {
    if (!tab[pv.PortVoie_VoieId]) tab[pv.PortVoie_VoieId] = {};
    tab[pv.PortVoie_VoieId][pv.PortVoie_PortId] = pv.PortVoie_Pk;
  });
  return tab;
}

function getPortPk(aggregatedPortsVoies, port1_id, port2_id) {
  for (const voie_id in aggregatedPortsVoies) {
    const pk1 = aggregatedPortsVoies[voie_id][port1_id];
    const pk2 = aggregatedPortsVoies[voie_id][port2_id];
    if (pk1 && pk2) return { port1_pk: pk1, port2_pk: pk2, voie_emprunte: voie_id };
  }
  return { port1_pk: 0, port2_pk: 0, voie_emprunte: null };
}

async function calculateWeights(troncon, aggregatedPortsVoies) {
  const { port1_pk, port2_pk, voie_emprunte } = getPortPk(aggregatedPortsVoies, troncon.Troncon_Port1Id, troncon.Troncon_Port2Id);
  const troncon_km = calculateTronconKm(port1_pk, port2_pk);
  const time_weight = calcule_temps(troncon_km, troncon.Troncon_Tunnel, troncon.Troncon_Vmax, troncon.Troncon_Ecluses, troncon.Troncon_CoefVitesse, troncon.Troncon_NbPontLevis, troncon.Troncon_Ecluses_Coefficient);
  return { troncon_km, time_weight, voie_emprunte };
}

async function calculatePathDetails(troncons, path, aggregatedPortsVoies) {
  let total_Km = 0;
  let total_Ecluses = 0;
  let total_Tunnel = 0;
  let total_Temps = 0;
  let total_Vmax = 0;
  let canals = {};
  let tronconWithoutCanal = [];
  let tempsCanal = 0;
  const tronconIds = [];
  
  for (let i = 0; i < path.length - 1; i++) {
    const tronconId = troncons.find(tr =>
      (tr.Troncon_Port1Id === path[i] && tr.Troncon_Port2Id === path[i + 1]) ||
      (tr.Troncon_Port1Id === path[i + 1] && tr.Troncon_Port2Id === path[i])
    ).Troncon_Id;
    tronconIds.push(tronconId);

  }


  const tronconPaths = await getTronconPathsGoogle(tronconIds);

  for (let i = 0; i < tronconIds.length; i++) {
    const tronconId = tronconIds[i];
    const troncon = await getTronconInfo(tronconId);
    total_Ecluses += troncon.Troncon_Ecluses;

    const { port1_pk, port2_pk, voie_emprunte } = getPortPk(aggregatedPortsVoies, troncon.Troncon_Port1Id, troncon.Troncon_Port2Id);
    const troncon_Km = calculateTronconKm(port1_pk, port2_pk);
    const canalInfo = await getCanalInfo(voie_emprunte);
    total_Km += troncon_Km;
    total_Tunnel += parseFloat(troncon.Troncon_Tunnel) || 0;
    total_Vmax = Math.max(total_Vmax, parseFloat(troncon.Troncon_Vmax) || 0);

    const my_temps = calcule_temps(troncon_Km, troncon.Troncon_Tunnel, troncon.Troncon_Vmax, troncon.Troncon_Ecluses, troncon.Troncon_CoefVitesse, troncon.Troncon_NbPontLevis, troncon.Troncon_Ecluses_Coefficient);
    total_Temps += my_temps;
    const tronconLocks = await getLocksByTronconId(tronconId);
    const tronconPontsLevis = await getPontsLevisByTronconId(tronconId);
    const portLoueurs1 = await getLoueursByPortId(troncon.Troncon_Port1Id);
    const portLoueurs2 = await getLoueursByPortId(troncon.Troncon_Port2Id);
    const portChantiers1 = await getChantiersByPortId(troncon.Troncon_Port1Id);
    const portChantiers2 = await getChantiersByPortId(troncon.Troncon_Port2Id);
    const tronconPath = tronconPaths.filter(path => path.Element_TronconId === tronconId);
    console.log('tronconPath:', tronconPath);
    tronconPath.forEach(element => {
      element.lat = parseFloat(element.lat);
      element.lng = parseFloat(element.lng);
    });
    //console.log('all info:', canalInfo, tronconLocks, tronconPontsLevis, portLoueurs1, portLoueurs2, portChantiers1, portChantiers2, tronconPath);
    if (canalInfo) {
      if (!canals[voie_emprunte]) {
        tempsCanal = 0;
        canals[voie_emprunte] = { ...canalInfo, troncons: [], order: i };
      }
      tempsCanal += my_temps;
      canals[voie_emprunte].tempsCanal = tempsCanal;
      canals[voie_emprunte].troncons.push({
        tronconId,
        Troncon_Port1Id: troncon.Troncon_Port1Id,
        Troncon_Port2Id: troncon.Troncon_Port2Id,
        port1_pk,
        port2_pk,
        troncon_Km,
        tronconLocks,
        tronconPontsLevis,
        tronconTemps: my_temps,
        Troncon_Vmax: troncon.Troncon_Vmax,
        Troncon_Ecluses: troncon.Troncon_Ecluses,
        Troncon_Tunnel: troncon.Troncon_Tunnel,
        Troncon_NbPontLevis: troncon.Troncon_NbPontLevis,
        portChantiers1,
        portChantiers2,
        portLoueurs1,
        portLoueurs2,
        tempsCanal,
        path : tronconPath,
      });
    } else {
      tronconWithoutCanal.push({
        tronconId,
        Troncon_Port1Id: troncon.Troncon_Port1Id,
        Troncon_Port2Id: troncon.Troncon_Port2Id,
        troncon_Km,
        tronconLocks,
        tronconPontsLevis,
        tronconTemps: my_temps,
        Troncon_Vmax: troncon.Troncon_Vmax,
        Troncon_Ecluses: troncon.Troncon_Ecluses,
        Troncon_Tunnel: troncon.Troncon_Tunnel,
        Troncon_NbPontLevis: troncon.Troncon_NbPontLevis,
        portChantiers1,
        portLoueurs1,
      });
    }
  }
  return {
    total_Km,
    total_Ecluses,
    total_Tunnel: total_Tunnel.toFixed(2),
    total_Temps: total_Temps,
    total_Vmax: total_Vmax.toFixed(2),
    canals: Object.values(canals).sort((a, b) => a.order - b.order),
    tronconWithoutCanal,
  };
}

const pathsAreEqual = (path1, path2) => {
  if (path1.length !== path2.length) return false;
  for (let i = 0; i < path1.length; i++) {
    if (path1[i] !== path2[i]) return false;
  }
  return true;
};

async function getData() {
  const [ports] = await pool.query(`SELECT Port_Id, Port_Nom FROM mappyfluvial_ports`);
  const [troncons] = await pool.query(`
    SELECT Troncon_Id, Troncon_Port1Id, Troncon_Port2Id, Troncon_Km, Troncon_Vmax, Troncon_Ecluses, Troncon_Tunnel, Troncon_Temps, 
           Troncon_TirantEau, Troncon_TirantAir, Troncon_Longueur, Troncon_Largeur, Troncon_CoefVitesse, Troncon_NbPontLevis, 
           Troncon_Ecluses_Coefficient 
    FROM mappyfluvial_troncons
  `);
  const [portsVoies] = await pool.query(`SELECT PortVoie_PortId, PortVoie_VoieId, PortVoie_Pk FROM mappyfluvial_ports_voies`);
  return { ports, troncons, portsVoies };
}
exports.calculateItinerary = async (points) => {
  try {
    const { ports, troncons, portsVoies } = await getData();
    const data = { ports, troncons, portsVoies };
    const aggregatedPortsVoies = aggregatePortsVoies(portsVoies);
    const returnData = [];

    let currentStartId = points[0];
    let fastestPathSegments = [];
    let fastestWeight = 0;
    for (let i = 1; i < points.length; i++) {
      const segment = await dijkstra(data, currentStartId, points[i], troncon => calculateWeights(troncon, aggregatedPortsVoies).then(res => res.time_weight));
      if (!segment) {
        return { error: { message: 'No path found' } };
      }
      if (i==points.length-1) {
        fastestPathSegments.push(segment.path);
      }
      else {
        fastestPathSegments.push(segment.path.slice(0, segment.path.length - 1));
      }
      fastestWeight += segment.weight;
      currentStartId = points[i];
    }
    const fastestPath = fastestPathSegments.flat();
    console.log('fastestPath :', fastestPath);
    if (fastestPath.length > 0) {
      const fastestPathDetails = await calculatePathDetails(troncons, fastestPath, aggregatedPortsVoies);
      returnData.push({ path: fastestPath, details: fastestPathDetails, name: 'fastestPath' });
    }

    currentStartId = points[0];
    let shortestPathSegments = [];
    let shortestWeight = 0;
    for (let i = 1; i < points.length; i++) {
      const segment = await dijkstra(data, currentStartId, points[i], troncon => calculateWeights(troncon, aggregatedPortsVoies).then(res => res.troncon_km));
      if (!segment) {
        return { error: { message: 'No path found' } };
      }
      if (i==points.length-1) {
        shortestPathSegments.push(segment.path);
      }
      else {
        shortestPathSegments.push(segment.path.slice(0, segment.path.length - 1));
      }
      shortestWeight += segment.weight;
      currentStartId = points[i];
    }



    const shortestPath = shortestPathSegments.flat();
    if (shortestPath.length > 0) {
      if (!pathsAreEqual(shortestPath, fastestPath)) {
        const shortestPathDetails = await calculatePathDetails(troncons, shortestPath, aggregatedPortsVoies);
        returnData.push({ path: shortestPath, details: shortestPathDetails, name: 'shortestPath' });
      }
    }

    currentStartId = points[0];
    let lessEclusesPathSegments = [];
    let lessEclusesWeight = 0;
    for (let i = 1; i < points.length; i++) {
      const segment = await dijkstra(data, currentStartId, points[i], troncon => troncon.Troncon_Ecluses);
      if (!segment) {
        return { error: { message: 'No path found' } };
      }
      if (i==points.length-1) {
        lessEclusesPathSegments.push(segment.path);
      }
      else {
        lessEclusesPathSegments.push(segment.path.slice(0, segment.path.length - 1));
      }
      lessEclusesWeight += segment.weight;
      currentStartId = points[i];
    }

    const lessEclusesPath = lessEclusesPathSegments.flat();
    
    
    if (lessEclusesPath.length > 0) {
      if (!pathsAreEqual(lessEclusesPath, fastestPath) && !pathsAreEqual(lessEclusesPath, shortestPath)) {
        const lessEclusesPathDetails = await calculatePathDetails(troncons, lessEclusesPath, aggregatedPortsVoies);
        returnData.push({ path: lessEclusesPath, details: lessEclusesPathDetails, name: 'lessEclusesPath' });
      }
    }

    if (returnData.length === 0) {
      console.log('No path found');
      return { error: { message: 'No path found' } };
    }
    console.log('returnData:', returnData);
    console.log('path found');
    return returnData;
  } catch (error) {
    console.error('Error calculating itinerary:', error);
    throw error;
  }
};
