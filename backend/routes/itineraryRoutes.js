// routes/itineraryRoutes.js
const express = require('express');
const router = express.Router();
const itineraryController = require('../controllers/itineraryController');


router.get('/ports/search', itineraryController.searchPorts);
router.get('/ports', itineraryController.getPorts);
router.get('/ports/:voie_id', itineraryController.getPortsByCanalId);
router.get('/calculate', itineraryController.calculateItinerary);

module.exports = router;
