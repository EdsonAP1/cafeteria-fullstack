const pool = require('../db');

const UsuarioModel = {
  // Buscar un usuario por su correo (para el Login)
  buscarPorEmail: async (email) => {
    const resultado = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    return resultado.rows[0]; // Devuelve el usuario si existe, o undefined si no
  },

  // Insertar un nuevo usuario (para el Registro)
  crear: async (email, passwordEncriptada, rol) => {
    const resultado = await pool.query(
      'INSERT INTO usuarios (email, password, rol) VALUES ($1, $2, $3) RETURNING id, email, rol;',
      [email, passwordEncriptada, rol]
    );
    return resultado.rows[0];
  }
};

module.exports = UsuarioModel;