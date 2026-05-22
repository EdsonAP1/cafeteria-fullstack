const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

// Caminos de autenticación (Ambos son públicos)
router.post('/registro', AuthController.registro);
router.post('/login', AuthController.login);

module.exports = router;