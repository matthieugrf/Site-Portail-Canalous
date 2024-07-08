const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Exemple de route d'authentification
router.post('/login', authController.login);
// Route pour /hello/
router.get('/hello', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
  });
module.exports = router;
