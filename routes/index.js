const express = require('express');
const router = express.Router();

// Importación de rutas
const inventarioRoutes = require('./inventarioRoutes');
const productRoutes = require('./productRoutes');
const requestRoutes = require('./requestRoutes');
const unityRoutes = require('./unidadRoutes');
const localidadRoutes = require('./localidadRoutes'); 
const userRoutes = require('./userRoutes'); 

// Las rutas
router.use('/i', inventarioRoutes); 
router.use('/p', productRoutes); 
router.use('/r', requestRoutes); 
router.use('/u', unityRoutes); 
router.use('/l', localidadRoutes);
router.use('/user', userRoutes);

// const usuarioRoutes = require('./usuarioRoutes');
// router.use('/usuarios', usuarioRoutes);

module.exports = router; 