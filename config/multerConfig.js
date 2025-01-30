const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Definir la ruta base para las imágenes de juegos
const UPLOAD_PATH = path.join(__dirname, '..', 'public', 'images', 'user');

// Crear el directorio si no existe
if (!fs.existsSync(UPLOAD_PATH)) {
  fs.mkdirSync(UPLOAD_PATH, { recursive: true });
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_PATH); // Usar la ruta absoluta
  },
  filename: function (req, file, cb) {
    // Crear un nombre de archivo único
    const uniqueSuffix = `user-${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes'), false);
  }
};

// Configuración de Multer
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

module.exports = {
  upload,
  UPLOAD_PATH
};