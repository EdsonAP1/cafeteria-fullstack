const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento temporal en la memoria del servidor
const storage = multer.memoryStorage();

// Filtro de seguridad: Solo dejamos pasar imágenes reales
const fileFilter = (req, file, cb) => {
  const tiposPermitidos = /jpeg|jpg|png|webp/;
  const mimeType = tiposPermitidos.test(file.mimetype);
  const extName = tiposPermitidos.test(path.extname(file.originalname).toLowerCase());

  if (mimeType && extName) {
    return cb(null, true);
  }
  cb(new Error("Error: El archivo debe ser una imagen válida (jpeg, jpg, png o webp)"));
};

// Inicializamos Multer con un límite de tamaño de 5MB por foto
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Megabytes
  fileFilter: fileFilter
});

// Exportamos el interceptor listo para escuchar un campo llamado "imagen"
module.exports = upload.single('imagen');