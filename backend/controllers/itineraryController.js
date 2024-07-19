// controllers/itineraryController.js
const pool = require('../config/dbConfig');
const itineraryService = require('../services/itineraryService');

exports.getPortsByCanalId = async (req, res) => {
  const { voie_id } = req.params;
  console.log('voie_id:', voie_id);
  try {
    const [rows] = await pool.query(
      `SELECT Port_Nom, Port_Id Port_MapX, Port_MapY
       FROM mappyfluvial_ports_voies
       LEFT JOIN mappyfluvial_ports ON Port_Id = PortVoie_PortId
       AND Port_Type IN (1,2,4)
       WHERE PortVoie_VoieId = ? AND Port_Nom != '' AND Port_Export_Fluvialcap = 1 
       ORDER BY PortVoie_Pk`,
      [voie_id]
    );

    const ports = rows.map(row => ({ 
      Port_Nom: row.Port_Nom ,
      Port_Id: row.Port_Id,
      Port_MapX: row.Port_MapX,
      Port_MapY: row.Port_MapY
    }));
    res.json({ ports });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.searchPorts = async (req, res) => {
  const { q } = req.query;
  console.log('q:', q);
  if (!q) {
    return res.status(400).json({ error: 'queryString is required' });
  }
  
  try {
    const [rows] = await pool.query(
      `SELECT Port_Nom, Port_Id
       FROM mappyfluvial_ports 
       WHERE Port_Type IN (1,2,4) 
         AND Port_Nom LIKE ? 
         AND Port_Nom != '' 
         AND Port_Export_Fluvialcap = 1 
       ORDER BY Port_Nom ASC 
       LIMIT 10`,
      [`${q}%`]
    );

    const ports = rows.map(row => ({ 
      Port_Nom: row.Port_Nom ,
      Port_Id: row.Port_Id
    }));
    res.json({ ports });
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.getPorts = async (req, res) => {
  console.log('getPorts');
  try {
    const [rows] = await pool.query(
      `SELECT Port_Id, Port_Nom, Port_MapX, Port_MapY, Port_Type, Port_Embranchement_Info
       FROM mappyfluvial_ports 
       WHERE Port_Nom != '' AND Port_Export_Fluvialcap = 1 
       ORDER BY Port_Nom ASC`
    );

    const ports = rows.map(row => ({
      Port_Id: row.Port_Id,
      Port_Nom: row.Port_Nom,
      Port_MapX: row.Port_MapX,
      Port_MapY: row.Port_MapY,
      Port_Type: row.Port_Type,
      Port_Embranchement_Info: row.Port_Embranchement_Info
    }));
    res.json({ ports });
  } catch (error) {
    console.error('Error fetching ports:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.calculateItinerary = async (req, res) => {
  try {
    const { pointIds } = req.query;
    const points = pointIds.split(',').map(id => parseInt(id, 10));
    console.log('calculateItinerary:', points);
    const result = await itineraryService.calculateItinerary(points);
    res.json(result);
  } catch (error) {
    console.error('Error calculating itinerary:', error);
    res.status(500).send('Server Error');
  }
};
