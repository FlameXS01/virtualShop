const express = require('express');
const router = express.Router();
const {
    crearInventario,
    obtenerInventarios,
    obtenerInventarioById,
    actualizarInventario,
    eliminarInventario,
} = require('../controllers/inventarioController'); 

// Ruta para crear un nuevo inventario
router.post('/inventarios', async (req, res) => {
    try {
        const nuevoInventario = await crearInventario(req.body); 
        res.status(201).json(nuevoInventario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para obtener todos los inventarios
router.get('/inventarios', async (req, res) => {
    try {
        const inventarios = await obtenerInventarios();
        res.status(200).json(inventarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para obtener un inventario por ID
router.get('/inventarios/:id', async (req, res) => {
    const { id } = req.params; 
    try {
        const inventario = await obtenerInventarioById(id); 
        res.status(200).json(inventario);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Ruta para actualizar un inventario
router.put('/inventarios/:id', async (req, res) => {
    const { id } = req.params; 
    const data = req.body; 
    try {
        const inventarioActualizado = await actualizarInventario(id, data); 
        res.status(200).json(inventarioActualizado);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Ruta para eliminar un inventario
router.delete('/inventarios/:id', async (req, res) => {
    const { id } = req.params; 
    try {
        await eliminarInventario(id); 
        res.status(204).send(); 
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router;