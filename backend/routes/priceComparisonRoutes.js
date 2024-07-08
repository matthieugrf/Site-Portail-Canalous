const express = require('express');
const router = express.Router();
const priceComparisonController = require('../controllers/priceComparisonController');

router.get('/compare', priceComparisonController.comparePrices);

module.exports = router;
