// src/index.js (Dentro de api-backend)

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // (La usaremos para encriptar más adelante)

const express = require('express');
const cors = require('cors'); 
// 1. IMPORTAMOS EL POOL QUE CONFIGURASTE EN db.js
const pool = require('./db'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.json()); 

// MIDDLEWARE: Filtro de Aduana para validar el Token JWT
function verificarToken(req, res, next) {
  // 1. Leemos el token que viene en los encabezados (Headers) de la petición
  const bearerHeader = req.headers['authorization'];

  if (!bearerHeader) {
    return res.status(403).json({ error: "Acceso denegado. No se proporcionó un token de seguridad." });
  }

  try {
    // El formato estándar de la industria es: "Bearer EL_TOKEN_AQUÍ"
    // Así que lo separamos por el espacio para quedarnos solo con el chorizo de letras
    const token = bearerHeader.split(' ')[1];

    // 2. Verificamos si el token es válido usando nuestra palabra secreta
    const verificado = jwt.verify(token, 'MI_LLAVE_SECRETA_SUPER_SUPER');
    
    // 3. Guardamos los datos del usuario dentro de la petición para usarlo después si queremos
    req.usuario = verificado;

    // 4. ¡Todo perfecto! Le damos permiso de pasar al siguiente comando
    next(); 
  } catch (error) {
    res.status(401).json({ error: "Token inválido o expirado. Acceso no autorizado." });
  }
}


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

// NUEVA RUTA: Autenticación y Generación de JWT
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const resultado = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    
    if (resultado.rows.length === 0) {
      return res.status(401).json({ error: "El correo electrónico no existe" });
    }

    const usuario = resultado.rows[0];

    // 2. VERIFICACIÓN CRIPTOGRÁFICA: Compara la clave del input con el Hash guardado en DB
    const contraseniaCorrecta = await bcrypt.compare(password, usuario.password);
    
    if (!contraseniaCorrecta) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // 3. GENERACIÓN DEL TOKEN
    const payload = { id: usuario.id, email: usuario.email, rol: usuario.rol };
    const token = jwt.sign(payload, 'MI_LLAVE_SECRETA_SUPER_SUPER', { expiresIn: '2h' });

    res.json({
      mensaje: "¡Login exitoso!",
      token: token,
      usuario: { email: usuario.email, rol: usuario.rol }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor al intentar iniciar sesión" });
  }
});


// RUTA DE REGISTRO: Encripta la contraseña y la guarda en Supabase
app.post('/api/registro', async (req, res) => {
  const { email, password, rol } = req.body;

  try {
    // 1. Encriptar la contraseña mediante hash con un factor de costo de 10 vueltas
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);

    // 2. Insertar el nuevo usuario con la clave protegida en la base de datos
    const nuevoUsuario = await pool.query(
      'INSERT INTO usuarios (email, password, rol) VALUES ($1, $2, $3) RETURNING id, email, rol',
      [email, passwordEncriptada, rol || 'empleado']
    );

    res.status(201).json({
      mensaje: "Usuario registrado con éxito encriptado",
      usuario: nuevoUsuario.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar el usuario, es posible que el correo ya exista" });
  }
});


// AGREGAR PRODUCTO (Ruta Protegida con el Middleware)
app.post('/api/productos', verificarToken, async (req, res) => {
  const { nombre, descripcion, precio } = req.body;
  
  try {
    const nuevoProducto = await pool.query(
      'INSERT INTO productos (nombre, descripcion, precio) VALUES ($1, $2, $3) RETURNING *',
      [nombre, descripcion, precio]
    );
    res.json(nuevoProducto.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al insertar en la base de datos' });
  }
});


app.listen(PORT, () => {
  console.log(`Servidor backend real corriendo con éxito en el puerto ${PORT}`);
});