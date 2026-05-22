const pool = require('../db');

const CategoriaModel = {
  obtenerTodas: async () => {
    const resultado = await pool.query('SELECT * FROM categorias ORDER BY id ASC;');
    return resultado.rows;
  }
};

module.exports = CategoriaModel;