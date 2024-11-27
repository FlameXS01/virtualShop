const express = require('express');
const router = express.Router();

// Importacion de rutas
const inventarioRoutes = require('./inventarioRoutes');

// const usuarioRoutes = require('./usuarioRoutes');

// Las rutas
router.use('/i', inventarioRoutes); 

// router.use('/usuarios', usuarioRoutes);

module.exports = router; // Exporta el router centralizado