const express = require('express');
const router = express.Router();

const ProductoController = require('../controllers/productoController');

// IMPORTACIÓN CORREGIDA: Ahora lo leemos desde la carpeta middlewares
const { verificarToken } = require('../middlewares/authMiddleware'); 

router.get('/', ProductoController.listarProductos);
router.post('/', verificarToken, ProductoController.guardarProducto);

module.exports = router;