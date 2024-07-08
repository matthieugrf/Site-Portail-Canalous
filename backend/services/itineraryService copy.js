const pool = require('../config/dbConfig');

// ============= PARAMETRES =============
const PARAM_nbmax_etapes = 75;
const PARAM_nbmax_trajets_ok = 100;
const PARAM_nbmax_jonctions = 25;
const PARAM_nbmax_autres_trajets = 3;

const PARAM_display_post = false;
const PARAM_display_tab_trajetok = false;
const PARAM_display_alltrajets = false;
const PARAM_display_debug = false;
const PARAM_display_autres_trajets = true;

let NB_trajet_ok = 0;
let NB_trajet_long = 0;
let NB_trajet_max_trajet = 0;

const ERROR_trop_trajet = 'ERROR_FLUVIACAP_TROP_TRAJET';
const ERROR_trop_long = 'ERROR_FLUVIACAP_TROP_LONG';
const ERROR_trop_gab = 'ERROR_FLUVIACAP_TROP_GAB';
const ERROR_trop_imp = 'ERROR_FLUVIACAP_TROP_IMPOSSIBLE';
// ======================================

async function calculeTemps(my_km, my_km_tunnel, my_vmax, my_ecluses, my_coef, nb_pontlevis, my_coef_ecluses) {
  const heures = ((my_km - my_km_tunnel) / (my_vmax * my_coef)) + (my_km_tunnel * 0.20) + (nb_pontlevis / 6) + (my_ecluses / my_coef_ecluses);
  return heures;
}

function formateTemps(heures) {
  const heuresStr = heures.toString();
  const [my_heures, decimalMinutes] = heuresStr.split('.');
  const minutes = (decimalMinutes ? parseFloat('0.' + decimalMinutes) : 0) * 60;
  const [my_minutes, decimalSecondes] = minutes.toString().split('.');
  const secondes = (decimalSecondes ? parseFloat('0.' + decimalSecondes) : 0) * 60;
  
  let temps = '';
  if (my_heures != 0) { temps += `${my_heures} H `; }
  if (my_minutes != 0) { temps += `${my_minutes} min.`; }
  return temps;
}

function unformateTemps(temps) {
  const [heures, minutes, secondes] = temps.split(':').map(parseFloat);
  return heures + (minutes / 60) + (secondes / 3600);
}

function ajouteTemps(temps1, temps2) {
  return temps1 + temps2;
}

async function trajet(point_depart, etape_i = 1, nb_jonctions = 0, filters, visited = new Set()) {
  let HTML_tracedebug = '';
  let TAB_trajet = { etapes: {}, troncons: {}, Troncon_: {} };
  let TAB_trajet_ok = [];
  let point_arrivee = global.point_arrivee;
  let prev_voieid = '';
  
  etape_i++;
  if (etape_i <= 2) {
    console.log('Depart: ' + point_depart);
  }
  HTML_tracedebug += `<br /><br /><br />------------- start point : ${point_depart} ------------------------------------------------ <br />`;

  let sql_filtre = "1=1";
  if (filters.search_longueur) {
    sql_filtre += ` AND Troncon_Longueur >= ${filters.search_longueur.replace(',', '.')}`;
  }
  if (filters.search_largeur) {
    sql_filtre += ` AND Troncon_Largeur >= ${filters.search_largeur.replace(',', '.')}`;
  }
  if (filters.search_tirantair) {
    sql_filtre += ` AND Troncon_TirantAir >= ${filters.search_tirantair.replace(',', '.')}`;
  }
  if (filters.search_tiranteau) {
    sql_filtre += ` AND Troncon_TirantEau >= ${filters.search_tiranteau.replace(',', '.')}`;
  }

  let sql = `SELECT Troncon_Id, Troncon_Port1Id, Troncon_Port2Id, Troncon_MontantAvalant 
             FROM mappyfluvial_troncons 
             WHERE ${sql_filtre} AND (Troncon_Port1Id='${point_depart}' OR Troncon_Port2Id='${point_depart}')`;
  
  const [rows] = await pool.query(sql);
  let i = 0;

  for (let tab of rows) {
    let avalant;
    if (tab.Troncon_Port1Id == point_depart) {
      avalant = tab.Troncon_MontantAvalant;
    } else if (tab.Troncon_Port2Id == point_depart && tab.Troncon_MontantAvalant == '1') {
      avalant = '0';
    } else if (tab.Troncon_Port2Id == point_depart && tab.Troncon_MontantAvalant == '0') {
      avalant = '1';
    }

    let next_point;
    if (tab.Troncon_Port1Id == point_depart) {
      next_point = tab.Troncon_Port2Id;
    } else if (tab.Troncon_Port2Id == point_depart) {
      next_point = tab.Troncon_Port1Id;
    }

    if (visited.has(next_point)) {
      HTML_tracedebug += `--- $next_point = ${next_point} already visited<br />`;
      continue;
    }

    let sql_voie = `SELECT v1.PortVoie_VoieId as PortVoie_VoieId
                    FROM mappyfluvial_ports_voies v1, mappyfluvial_ports_voies v2
                    WHERE v1.PortVoie_PortId = ${point_depart} AND v2.PortVoie_PortId = ${next_point}
                    AND v2.PortVoie_VoieId = v1.PortVoie_VoieId`;

    const [voieRows] = await pool.query(sql_voie);
    let current_voieid = voieRows[0]?.PortVoie_VoieId || '';

    if (current_voieid) {
      if (current_voieid != prev_voieid) { 
        nb_jonctions++; 
      }
      prev_voieid = current_voieid;

      HTML_tracedebug += `<br />--- prochain troncon : de ${point_depart} à ${next_point} --- (voie id : ${current_voieid} / $nb_jonctions = ${nb_jonctions})<br />`;
      HTML_tracedebug += sql_voie;

      for (let myetapeid in TAB_trajet.etapes) {
        if (myetapeid > etape_i) {
          delete TAB_trajet.etapes[myetapeid];
          delete TAB_trajet.troncons[myetapeid];
        }
      }

      let point_viewed = Object.values(TAB_trajet.etapes).indexOf(next_point);
      HTML_tracedebug += `--- $next_point = ${next_point} / $point_viewed = ${point_viewed}<br />`;

      if (point_viewed == -1) {
        TAB_trajet.etapes[etape_i] = next_point;
        TAB_trajet.troncons[etape_i] = tab.Troncon_Id;
        // Ensure the object exists before setting properties
        if (!TAB_trajet[`Troncon_${tab.Troncon_Id}`]) {
          TAB_trajet[`Troncon_${tab.Troncon_Id}`] = {};
        }
        TAB_trajet[`Troncon_${tab.Troncon_Id}`].Avalant = avalant;
        HTML_tracedebug += `$TAB_trajet['etapes'][${etape_i}] = ${next_point}<br />`;
        i++;

        if (next_point == point_arrivee) {
          NB_trajet_ok++;
          TAB_trajet_ok[NB_trajet_ok] = JSON.parse(JSON.stringify(TAB_trajet));
        } else if (NB_trajet_ok >= PARAM_nbmax_trajets_ok) {
          NB_trajet_max_trajet++;
        } else if (nb_jonctions >= PARAM_nbmax_jonctions) {
          NB_trajet_long++;
        } else if (etape_i >= PARAM_nbmax_etapes) {
          NB_trajet_long++;
        } else {
          visited.add(next_point);
          const sub_trajet_ok = await trajet(next_point, etape_i, nb_jonctions, filters, visited);
          TAB_trajet_ok = TAB_trajet_ok.concat(sub_trajet_ok);
        }
      } else {
        HTML_tracedebug += `point "${next_point}" déjà visité<br />`;
      }
    }
  }

  console.log(`Returning TAB_trajet_ok: ${JSON.stringify(TAB_trajet_ok)}`);
  return TAB_trajet_ok;
}

async function calculateItinerary(startId, endId, filters) {
  global.point_arrivee = endId;
  console.log(`Starting calculateItinerary with startId: ${startId}, endId: ${endId}, filters: ${JSON.stringify(filters)}`);

  // Initialisation des variables
  let HTML_tracedebug = '';
  let TAB_trajet = { etapes: {}, troncons: {}, Troncon_: {} };
  let TAB_trajet_ok = [];
  let etape_i = 1;
  let nb_trajets_ok = 0;
  let nb_jonctions = 0;
  let vieux_voie_id = '';

  TAB_trajet.etapes[etape_i] = startId; // initialise le trajet

  // Lancer la recherche de trajets
  const trajets = await trajet(startId, etape_i, nb_jonctions, filters, new Set([startId]));

  // Calculer les paramètres des trajets
  for (let mytrajet_id in trajets) {
    let TAB_mytrajet = trajets[mytrajet_id];
    let total_Km = 0;
    let total_Km_Calculated = 0;
    let total_Ecluses = 0;
    let total_Tunnel = 0;
    let total_Temps = 0;
    let total_Temps_Calculated = 0;
    let total_Vmax = 0;
    let total_TEmax = 1000;
    let total_TAmax = 1000;
    let total_TLongmax = 1000;
    let total_TLargmax = 1000;

    for (let troncon_id in TAB_mytrajet.troncons) {
      let sql = `SELECT Troncon_Port1Id, Troncon_Port2Id, Troncon_Tunnel, Troncon_Vmax, Troncon_Ecluses, Troncon_TirantEau, Troncon_TirantAir, Troncon_Longueur, Troncon_Largeur, Troncon_CoefVitesse, Troncon_Temps, Troncon_NbPontLevis, Troncon_Ecluses_Coefficient 
                 FROM mappyfluvial_troncons 
                 WHERE Troncon_Id='${troncon_id}'`;
      console.log(`Executing troncon query: ${sql}`);
      const [rows] = await pool.query(sql);
      console.log(`Troncon rows returned: ${rows.length}`);
      let tab = rows[0];
      total_Ecluses += tab.Troncon_Ecluses;

      let port1_id = tab.Troncon_Port1Id;
      let port2_id = tab.Troncon_Port2Id;
      let TAB_portsvoies_pk = {};

      let sql_port1 = `SELECT PortVoie_VoieId, PortVoie_Pk 
                       FROM mappyfluvial_ports_voies 
                       WHERE PortVoie_PortId='${port1_id}'`;
      console.log(`Executing port1 query: ${sql_port1}`);
      const [req_port1] = await pool.query(sql_port1);
      req_port1.forEach(tab_port1 => {
        let voie_id = tab_port1.PortVoie_VoieId;
        TAB_portsvoies_pk[voie_id] = TAB_portsvoies_pk[voie_id] || {};
        TAB_portsvoies_pk[voie_id][port1_id] = tab_port1.PortVoie_Pk;
      });

      let sql_port2 = `SELECT PortVoie_VoieId, PortVoie_Pk 
                       FROM mappyfluvial_ports_voies 
                       WHERE PortVoie_PortId='${port2_id}'`;
      console.log(`Executing port2 query: ${sql_port2}`);
      const [req_port2] = await pool.query(sql_port2);
      req_port2.forEach(tab_port2 => {
        let voie_id = tab_port2.PortVoie_VoieId;
        TAB_portsvoies_pk[voie_id] = TAB_portsvoies_pk[voie_id] || {};
        TAB_portsvoies_pk[voie_id][port2_id] = tab_port2.PortVoie_Pk;
      });

      let port1_pk = '';
      let port2_pk = '';
      let voie_emprunte = '';
      for (let voie_id in TAB_portsvoies_pk) {
        if (Object.keys(TAB_portsvoies_pk[voie_id]).length == 2) {
          port1_pk = TAB_portsvoies_pk[voie_id][port1_id];
          port2_pk = TAB_portsvoies_pk[voie_id][port2_id];
          voie_emprunte = voie_id;
        }
      }

      let troncon_Km = Math.abs(port1_pk - port2_pk);
      total_Km_Calculated += troncon_Km;
      total_Km += tab.Troncon_Km;
      total_Tunnel += tab.Troncon_Tunnel;
      if (tab.Troncon_Vmax > total_Vmax) {
        total_Vmax = tab.Troncon_Vmax;
      }

      let Troncon_Temps = unformateTemps(tab.Troncon_Temps);
      total_Temps = ajouteTemps(total_Temps, Troncon_Temps);

      let my_temps = await calculeTemps(troncon_Km, tab.Troncon_Tunnel, tab.Troncon_Vmax, tab.Troncon_Ecluses, tab.Troncon_CoefVitesse, tab.Troncon_NbPontLevis, tab.Troncon_Ecluses_Coefficient);

      if (tab.Troncon_TirantAir < total_TAmax) {
        total_TAmax = tab.Troncon_TirantAir;
      }
      if (tab.Troncon_TirantEau < total_TEmax) {
        total_TEmax = tab.Troncon_TirantEau;
      }
      if (tab.Troncon_Longueur < total_TLongmax) {
        total_TLongmax = tab.Troncon_Longueur;
      }
      if (tab.Troncon_Largeur < total_TLargmax) {
        total_TLargmax = tab.Troncon_Largeur;
      }

      total_Temps_Calculated = ajouteTemps(total_Temps_Calculated, my_temps);

      TAB_trajet_ok[mytrajet_id] = TAB_trajet_ok[mytrajet_id] || { troncons: {} };
      TAB_trajet_ok[mytrajet_id]['troncons'][troncon_id] = {
        Km: troncon_Km,
        Temps: my_temps,
        Ecluses: tab.Troncon_Ecluses,
        NbPontLevis: tab.Troncon_NbPontLevis,
        CoefVitesse: tab.Troncon_CoefVitesse,
        Voie_Id: voie_emprunte,
        TirantAir: tab.Troncon_TirantAir,
        TirantEau: tab.Troncon_TirantEau,
        Longueur: tab.Troncon_Longueur,
        Largeur: tab.Troncon_Largeur
      };
    }

    TAB_trajet_ok[mytrajet_id] = {
      Km: total_Km,
      Km_Calculated: total_Km_Calculated,
      Ecluses: total_Ecluses,
      NbPontLevis: total_NbPontLevis,
      Tunnel: total_Tunnel,
      Temps: total_Temps,
      Temps_Calculated: total_Temps_Calculated,
      Vmax: total_Vmax
    };
  }

  // Détermine les trajets optimaux
  let TRAJET_lepluscourt, TRAJET_leplusrapide, TRAJET_lemoinsecluses;
  let shorter_distance = '', shorter_temps = '', shorter_nbecluses = '';
  let TAB_autres_trajets = [], TAB_autres_unsorted = {};

  for (let mytrajet_id in TAB_trajet_ok) {
    let distance = TAB_trajet_ok[mytrajet_id]['Km_Calculated'];
    if (distance < shorter_distance || shorter_distance == '') {
      TRAJET_lepluscourt = mytrajet_id;
      shorter_distance = distance;
    }

    let temps = TAB_trajet_ok[mytrajet_id]['Temps_Calculated'];
    if (temps < shorter_temps || shorter_temps == '') {
      TRAJET_leplusrapide = mytrajet_id;
      shorter_temps = temps;
    }

    let nbecluses = TAB_trajet_ok[mytrajet_id]['Ecluses'];
    if (nbecluses < shorter_nbecluses || shorter_nbecluses == '') {
      TRAJET_lemoinsecluses = mytrajet_id;
      shorter_nbecluses = nbecluses;
    }

    if (mytrajet_id != TRAJET_lepluscourt && mytrajet_id != TRAJET_leplusrapide && mytrajet_id != TRAJET_lemoinsecluses) {
      TAB_autres_unsorted[mytrajet_id] = distance;
    }
  }

  if (Object.keys(TAB_autres_unsorted).length > 0) {
    let sortedKeys = Object.keys(TAB_autres_unsorted).sort((a, b) => TAB_autres_unsorted[a] - TAB_autres_unsorted[b]);
    TAB_autres_trajets = sortedKeys.slice(0, PARAM_nbmax_autres_trajets);
  }

  // Générer le HTML des trajets
  let HTML_trajets = '';
  if (NB_trajet_ok > 0) {
    HTML_trajets += await afficheTrajet(TRAJET_lepluscourt, true);
    if (TRAJET_leplusrapide != TRAJET_lepluscourt) {
      HTML_trajets += await afficheTrajet(TRAJET_leplusrapide, false);
    }
    if (TRAJET_lemoinsecluses != TRAJET_lepluscourt && TRAJET_lemoinsecluses != TRAJET_leplusrapide) {
      HTML_trajets += await afficheTrajet(TRAJET_lemoinsecluses, false);
    }
    if (PARAM_display_autres_trajets) {
      for (let mytrajet_id of TAB_autres_trajets) {
        HTML_trajets += await afficheTrajet(mytrajet_id, false);
      }
    }
  } else {
    HTML_trajets += '<div class="trajet impossible">' + ERROR_trop_imp + '<br />';
    HTML_trajets += '<span class="soit"> - ' + ERROR_trop_imp + ' 1</span><br />';
    HTML_trajets += '<span class="soit"> - ' + ERROR_trop_imp + ' 2</span><br />';
    HTML_trajets += '<span class="soit"> - ' + ERROR_trop_imp + ' 3</span>';
    HTML_trajets += '</div>';
  }

  console.log(`Returning final results.`);
  return {
    shortest_route: TAB_trajet_ok[TRAJET_lepluscourt],
    fastest_route: TAB_trajet_ok[TRAJET_leplusrapide],
    least_ecluses_route: TAB_trajet_ok[TRAJET_lemoinsecluses]
  };
}

async function afficheTrajet(trajetId, highlight) {
  // Logique pour générer le HTML pour un trajet donné
  return `<div class="trajet">${highlight ? 'Trajet en surbrillance' : 'Trajet'}</div>`;
}

module.exports = {
  calculateItinerary,
  calculeTemps,
  formateTemps,
  unformateTemps,
  ajouteTemps,
  trajet,
};
