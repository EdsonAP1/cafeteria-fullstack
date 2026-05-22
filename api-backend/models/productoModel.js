// Importamos la conexión a Supabase que ya tenías en db.js
const pool = require('../db'); 

// Objeto que agrupa las funciones de la base de datos
const ProductoModel = {
  
  // Función para obtener todos los cafés de la tabla
  obtenerTodos: async () => {
    const resultado = await pool.query('SELECT * FROM productos ORDER BY id ASC;');
    return resultado.rows; // Devuelve solo el arreglo de datos limpio
  },

  // Función para insertar un nuevo café en la tabla
  crear: async (nombre, descripcion, precio) => {
    const resultado = await pool.query(
      'INSERT INTO productos (nombre, descripcion, precio) VALUES ($1, $2, $3) RETURNING *;',
      [nombre, descripcion, precio]
    );
    return resultado.rows[0]; // Devuelve el objeto que se acaba de guardar
  },


 /// 3. Actualizar un producto existente (¡Agregado aquí adentro!)
  actualizar: async (id, nombre, descripcion, precio) => {
    const resultado = await pool.query(
      'UPDATE productos SET nombre = $1, descripcion = $2, precio = $3 WHERE id = $4 RETURNING *;',
      [nombre, descripcion, precio, id]
    );
    return resultado.rows[0];
  },

  // 4. Eliminar un producto (¡Agregado aquí adentro!)
  eliminar: async (id) => {
    await pool.query('DELETE FROM productos WHERE id = $1;', [id]);
    return { mensaje: "Producto eliminado correctamente" };
  }
};




// Exportamos el modelo para que el controlador lo pueda usar
module.exports = ProductoModel;
