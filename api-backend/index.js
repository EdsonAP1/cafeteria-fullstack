
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.json()); 

// IMPORTACIÓN DE MÓDULOS DE RUTAS
const productoRoutes = require('./routes/productoRoutes');
const authRoutes = require('./routes/authRoutes');

// ENRUTAMIENTO GLOBAL
app.use('/api/productos', productoRoutes);
app.use('/api', authRoutes); // Esto manejará /api/login y /api/registro

app.listen(PORT, () => {
  console.log(`🚀 Servidor 100% en arquitectura MVC corriendo en el puerto ${PORT}`);
});