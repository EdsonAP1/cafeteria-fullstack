const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UsuarioModel = require('../models/usuarioModel');

const AuthController = {
  // Lógica de Registro
  registro: async (req, res) => {
    const { email, password, rol } = req.body;
    try {
      const salt = await bcrypt.genSalt(10);
      const passwordEncriptada = await bcrypt.hash(password, salt);

      const nuevoUsuario = await UsuarioModel.crear(email, passwordEncriptada, rol || 'empleado');
      
      res.status(201).json({
        mensaje: "Usuario registrado con éxito encriptado",
        usuario: nuevoUsuario
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al registrar el usuario" });
    }
  },

  // Lógica de Login
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const usuario = await UsuarioModel.buscarPorEmail(email);
      if (!usuario) {
        return res.status(401).json({ error: "El correo electrónico no existe" });
      }

      const contraseniaCorrecta = await bcrypt.compare(password, usuario.password);
      if (!contraseniaCorrecta) {
        return res.status(401).json({ error: "Contraseña incorrecta" });
      }

      // Cambia la frase larga por esto:
const token = jwt.sign(
  { id: usuario.id, email: usuario.email, rol: usuario.rol },
  process.env.JWT_SECRET, // <-- Lee el secreto del archivo oculto
  { expiresIn: '2h' }
);

      res.json({
        mensaje: "¡Login exitoso!",
        token: token,
        usuario: { email: usuario.email, rol: usuario.rol }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error en el servidor al intentar iniciar sesión" });
    }
  }
};

module.exports = AuthController;