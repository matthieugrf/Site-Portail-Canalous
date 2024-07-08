const pool = require('../config/dbConfig');

// Utilitaires pour la conversion et le formatage du temps
function parseTime(timeStr) {
  const [hours, minutes, seconds] = timeStr.split(":").map(Number);
  return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;
  return `${hours}:${minutes}:${seconds}`;
}

function calcule_temps(km, km_tunnel, vmax, ecluses, coef, nb_pontlevis, coef_ecluses) {
  return ((km - km_tunnel) / (vmax * coef)) + (km_tunnel * 0.20) + (nb_pontlevis / 6) + (ecluses / coef_ecluses);
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

function dijkstra(data, startId, endId, weightFunc) {
  const distances = {};
  const previous = {};
  const queue = new Set(data.ports.map(port => port.Port_Id));

  data.ports.forEach(port => {
    distances[port.Port_Id] = Infinity;
  });
  distances[startId] = 0;

  while (queue.size > 0) {
    const currentId = [...queue].reduce((minId, id) => distances[id] < distances[minId] ? id : minId);
    if (currentId === endId) break;
    queue.delete(currentId);

    const neighbors = data.troncons.filter(troncon =>
      troncon.Troncon_Port1Id === currentId || troncon.Troncon_Port2Id === currentId);
    neighbors.forEach(troncon => {
      const neighborId = troncon.Troncon_Port1Id === currentId ? troncon.Troncon_Port2Id : troncon.Troncon_Port1Id;
      if (!queue.has(neighborId)) return;

      const alt = distances[currentId] + weightFunc(troncon);
      if (alt < distances[neighborId]) {
        distances[neighborId] = alt;
        previous[neighborId] = currentId;
      }
    });
  }

  const path = [];
  let u = endId;
  while (previous[u] !== undefined) {
    path.unshift(u);
    u = previous[u];
  }
  if (u === startId) path.unshift(u);

  return { path, distance: distances[endId] };
}

function distanceWeight(troncon) {
  return troncon.Troncon_Km;
}

function timeWeight(troncon) {
  return parseTime(troncon.Troncon_Temps);
}

async function calculatePathDetails(troncons, path) {
  let total_Km = 0;
  let total_Km_Calculated = 0;
  let total_Ecluses = 0;
  let total_Tunnel = 0;
  let total_Temps = 0;
  let total_Vmax = 0;

  for (let i = 0; i < path.length - 1; i++) {
    const tronconId = troncons.find(tr =>
      (tr.Troncon_Port1Id === path[i] && tr.Troncon_Port2Id === path[i + 1]) ||
      (tr.Troncon_Port1Id === path[i + 1] && tr.Troncon_Port2Id === path[i])
    ).Troncon_Id;

    const troncon = await getTronconInfo(tronconId);

    total_Ecluses += troncon.Troncon_Ecluses;

    const port1_id = troncon.Troncon_Port1Id;
    const port2_id = troncon.Troncon_Port2Id;

    const portsVoies1 = await getPortsVoies(port1_id);
    const portsVoies2 = await getPortsVoies(port2_id);

    let port1_pk = '';
    let port2_pk = '';
    let voie_emprunte = '';
    const TAB_portsvoies_pk = {};

    portsVoies1.forEach(pv1 => {
      portsVoies2.forEach(pv2 => {
        if (pv1.PortVoie_VoieId === pv2.PortVoie_VoieId) {
          if (!TAB_portsvoies_pk[pv1.PortVoie_VoieId]) {
            TAB_portsvoies_pk[pv1.PortVoie_VoieId] = {};
          }
          TAB_portsvoies_pk[pv1.PortVoie_VoieId][port1_id] = pv1.PortVoie_Pk;
          TAB_portsvoies_pk[pv1.PortVoie_VoieId][port2_id] = pv2.PortVoie_Pk;
        }
      });
    });

    for (const voie_id in TAB_portsvoies_pk) {
      if (Object.keys(TAB_portsvoies_pk[voie_id]).length === 2) {
        port1_pk = TAB_portsvoies_pk[voie_id][port1_id];
        port2_pk = TAB_portsvoies_pk[voie_id][port2_id];
        voie_emprunte = voie_id;
        break;
      }
    }

    let troncon_Km = 0;
    if (port1_pk > port2_pk) {
      troncon_Km = port1_pk - port2_pk;
    } else if (port1_pk < port2_pk) {
      troncon_Km = port2_pk - port1_pk;
    }

    total_Km_Calculated += troncon_Km;
    total_Km += troncon_Km; // Correction : on utilise le km calculé
    total_Tunnel += parseFloat(troncon.Troncon_Tunnel) || 0; // Assurez-vous que total_Tunnel est un nombre
    total_Vmax = Math.max(total_Vmax, parseFloat(troncon.Troncon_Vmax) || 0); // Assurez-vous que total_Vmax est un nombre

    //const Troncon_Temps = parseTime(troncon.Troncon_Temps);
    //total_Temps += Troncon_Temps;
    console.log(troncon_Km, troncon);
    const my_temps = calcule_temps(troncon_Km, troncon.Troncon_Tunnel, troncon.Troncon_Vmax, troncon.Troncon_Ecluses, troncon.Troncon_CoefVitesse, troncon.Troncon_NbPontLevis, troncon.Troncon_Ecluses_Coefficient);
    total_Temps += my_temps;
  }

  return {
    total_Km,
    total_Ecluses,
    total_Tunnel: total_Tunnel.toFixed(2), // Corriger le format de total_Tunnel
    total_Temps: total_Temps,
    total_Vmax: total_Vmax.toFixed(2) // Corriger le format de total_Vmax
  };
}

exports.calculateItinerary = async (startId, endId) => {
  try {
    const [ports] = await pool.query(`SELECT Port_Id, Port_Nom FROM mappyfluvial_ports`);
    const [troncons] = await pool.query(`
      SELECT Troncon_Id, Troncon_Port1Id, Troncon_Port2Id, Troncon_Km, Troncon_Vmax, Troncon_Ecluses, Troncon_Temps, 
             Troncon_TirantEau, Troncon_TirantAir, Troncon_Longueur, Troncon_Largeur, Troncon_CoefVitesse, Troncon_NbPontLevis, 
             Troncon_Ecluses_Coefficient 
      FROM mappyfluvial_troncons
    `);

    const data = { ports, troncons };

    const shortestPath = dijkstra(data, startId, endId, distanceWeight);
    const fastestPath = dijkstra(data, startId, endId, timeWeight);

    if (!shortestPath.path.length) {
      return {
        //shortestPath: { path: [], distance: null, details: { total_Km: 0, total_Km_Calculated: 0, total_Ecluses: 0, total_Tunnel: "0.00", total_Temps: "0:0:0", total_Vmax: "0.00" } },
        fastestPath: { path: fastestPath.path, distance: fastestPath.distance, details: await calculatePathDetails(troncons, fastestPath.path) }
      };
    }

    const shortestPathDetails = await calculatePathDetails(troncons, shortestPath.path);
    const fastestPathDetails = await calculatePathDetails(troncons, fastestPath.path);

    return {
      //shortestPath: { ...shortestPath, details: shortestPathDetails },
      fastestPath: { ...fastestPath, details: fastestPathDetails }
    };
  } catch (error) {
    console.error('Error calculating itinerary:', error);
    throw error;
  }
};
