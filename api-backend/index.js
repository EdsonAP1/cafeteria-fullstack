// src/index.js (Dentro de api-backend)

const express = require('express');
const cors = require('cors'); 
// 1. IMPORTAMOS EL POOL QUE CONFIGURASTE EN db.js
const pool = require('./db'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.json()); 

// 2. RUTA GET MODIFICADA (MIRA EL ASYNC)
app.get('/api/productos', async (req, res) => {
  try {
    // Ejecutamos la consulta SQL en la base de datos en la nube
    const resultado = await pool.query('SELECT * FROM productos ORDER BY id ASC;');
    
    // resultado.rows contiene el Array de objetos puro que viene del disco duro
    res.json(resultado.rows);
  } catch (error) {
    console.error("Error en GET /api/productos:", error);
    res.status(500).json({ error: "Error al consultar la base de datos" });
  }
});

// 3. RUTA POST MODIFICADA
app.post('/api/productos', async (req, res) => {
  try {
    const { nombre, descripcion, precio } = req.body;
    
    // Inserción segura con parámetros mapeados ($1, $2, $3)
    const consultaSQL = `
      INSERT INTO productos (nombre, descripcion, precio) 
      VALUES ($1, $2, $3) 
      RETURNING *;
    `;
    
    const valores = [nombre, descripcion, precio];
    const resultado = await pool.query(consultaSQL, valores);
    
    // Devolvemos el producto creado (está en la primera fila del resultado)
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error("Error en POST /api/productos:", error);
    res.status(500).json({ error: "Error al insertar en la base de datos" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend real corriendo con éxito en el puerto ${PORT}`);
});