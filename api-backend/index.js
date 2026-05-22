require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. CONFIGURACIONES GLOBALES (Siempre primero)
app.use(cors()); 
app.use(express.json()); 

// 2. IMPORTACIÓN DE MÓDULOS DE RUTAS
const productoRoutes = require('./routes/productoRoutes');
const authRoutes = require('./routes/authRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes'); // Nuevo módulo relacional

// 3. ENRUTAMIENTO GLOBAL (Siempre después de las configuraciones)
app.use('/api/productos', productoRoutes);
app.use('/api/categorias', categoriaRoutes); // Ruta para alimentar tus menús desplegables
app.use('/api', authRoutes); 

app.listen(PORT, () => {
  console.log(`🚀 Servidor 100% en arquitectura MVC corriendo en el puerto ${PORT}`);
});