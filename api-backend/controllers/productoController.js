// Importamos el cocinero (el modelo)
const ProductoModel = require('../models/productoModel');

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
    const { nombre, descripcion, precio } = req.body;

    // ¡Aquí el mesero hace su trabajo de validar!
    if (!nombre || !descripcion || !precio) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    try {
      // Le pedimos al modelo que lo cocine (lo guarde en la DB)
      const nuevoProducto = await ProductoModel.crear(nombre, descripcion, precio);
      res.status(201).json(nuevoProducto);
    } catch (error) {
      console.error("Error en guardarProducto:", error);
      res.status(500).json({ error: "Error al insertar el producto" });
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