// Importamos el cocinero (el modelo)
const ProductoModel = require('../models/productoModel');

const supabase = require('../supabaseClient');

const ProductoController = {

  // Controlador para listar el menú
  listarProductos: async (req, res) => {
    try {
      const productos = await ProductoModel.obtenerTodos();
      res.json(productos); // Le responde al cliente con los datos que trajo el modelo
    } catch (error) {
      console.error("Error en listarProductos:", error);
      res.status(500).json({ error: "Error al consultar los productos" });
    }
  },

  // Controlador para guardar un café nuevo
  guardarProducto: async (req, res) => {
    const { nombre, descripcion, precio, categoria_id } = req.body;
    let imagen_url = null;

    try {
      // 1. Si el administrador subió una foto, la enviamos a Supabase Storage
      if (req.file) {
        // Creamos un nombre único para el archivo usando el tiempo actual para que no se dupliquen
        const nombreArchivo = `${Date.now()}_${req.file.originalname}`;

        // Subimos el archivo binario directamente al bucket público
        const { data, error } = await supabase.storage
          .from('imagenes-cafeteria') // Tu bucket creado
          .upload(nombreArchivo, req.file.buffer, {
            contentType: req.file.mimetype,
            upsert: true
          });

        if (error) throw error;

        // Extraemos la URL pública que generó Supabase para esa imagen
        const { data: publicUrlData } = supabase.storage
          .from('imagenes-cafeteria')
          .getPublicUrl(nombreArchivo);

        imagen_url = publicUrlData.publicUrl;
      }

      // 2. Guardamos el producto en PostgreSQL inyectando la URL real de la nube
      const nuevoProducto = await ProductoModel.crear(nombre, descripcion, precio, categoria_id, imagen_url);
      
      res.status(201).json(nuevoProducto);
    } catch (error) {
      console.error("Error completo en guardado:", error);
      res.status(500).json({ error: "Error al guardar el producto con imagen en la nube" });
    }
  },

  // Controlador para editar un café
  editarProducto: async (req, res) => {
    const { id } = req.params; // Extrae el ID de la URL
    const { nombre, descripcion, precio } = req.body;

    try {
      const productoEditado = await ProductoModel.actualizar(id, nombre, descripcion, precio);
      if (!productoEditado) return res.status(404).json({ error: "Producto no encontrado" });
      res.json(productoEditado);
    } catch (error) {
      res.status(500).json({ error: "Error al editar el producto" });
    }
  },

  // Controlador para borrar un café
  borrarProducto: async (req, res) => {
    const { id } = req.params;
    try {
      await ProductoModel.eliminar(id);
      res.json({ mensaje: "¡Producto borrado con éxito!" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar el producto" });
    }
  }


};



module.exports = ProductoController;