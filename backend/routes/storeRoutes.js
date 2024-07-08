const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

router.get('/products', storeController.getProducts);

module.exports = router;
