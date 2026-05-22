const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (!bearerHeader) {
    return res.status(403).json({ error: "Acceso denegado. No se proporcionó un token." });
  }
  try {
    const token = bearerHeader.split(' ')[1];
    // Cambia el jwt.verify para que quede así:
    const verificado = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = verificado;
    next(); 
  } catch (error) {
    res.status(401).json({ error: "Token inválido o expirado." });
  }
}

module.exports = { verificarToken };