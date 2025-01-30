const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ruta específica para productos
const PRODUCTS_UPLOAD_PATH = path.join(__dirname, '..', 'public', 'images', 'products');

// Crear directorio si no existe
if (!fs.existsSync(PRODUCTS_UPLOAD_PATH)) {
    fs.mkdirSync(PRODUCTS_UPLOAD_PATH, { recursive: true });
}

// Configuración exclusiva para productos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
    cb(null, PRODUCTS_UPLOAD_PATH);
    },
    filename: (req, file, cb) => {
    const uniqueSuffix = `product-${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Filtro de tipos de archivo
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
    cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes (JPG, PNG, WEBP)'), false);
    }
};

// Configuración final
const uploadProducts = multer({
    storage,
    fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB
});

module.exports = {
    uploadProducts,
    PRODUCTS_UPLOAD_PATH
};