const express = require('express');
const router = express.Router();
const CategoriaModel = require('../models/categoriaModel');

// Ruta pública para que cualquiera lea las categorías disponibles
router.get('/', async (req, res) => {
  try {
    const lista = await CategoriaModel.obtenerTodas();
    res.json(lista);
  } catch (error) {
    res.status(500).json({ error: "Error al consultar las categorías" });
  }
});

module.exports = router;