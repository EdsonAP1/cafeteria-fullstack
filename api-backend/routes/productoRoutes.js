const express = require('express');
const router = express.Router();

const ProductoController = require('../controllers/productoController');
const { verificarToken } = require('../middlewares/authMiddleware'); 

// 1. RUTAS ESTÁTICAS (Apuntan a la raíz /)
router.get('/', ProductoController.listarProductos);
router.post('/', verificarToken, ProductoController.guardarProducto);

// 2. RUTAS DINÁMICAS (Requieren el ID específico en la URL)
router.put('/:id', verificarToken, ProductoController.editarProducto); 
router.delete('/:id', verificarToken, ProductoController.borrarProducto);

module.exports = router;