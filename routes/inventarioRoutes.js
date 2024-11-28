const express = require('express');
const router = express.Router();
const {
    crearInventario,
    obtenerInventarios,
    obtenerInventarioById,
    actualizarInventario,
    eliminarInventario,
} = require('../controllers/inventarioController'); 

/**
 * @swagger
 * tags:
 *   name: Inventarios
 *   description: API para gestionar inventarios
 */

/**
 * @swagger
 * /api/i/add-inventarios:
 *   post:
 *     summary: Crear un nuevo inventario
 *     tags: [Inventarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               last_review:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Inventario creado con éxito
 *       500:
 *         description: Error al crear el inventario
 */
router.post('/add-inventarios', async (req, res) => {
    try {
        const nuevoInventario = await crearInventario(req.body); 
        res.status(201).json(nuevoInventario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/i/get-inventarios:
 *   get:
 *     summary: Obtener todos los inventarios
 *     tags: [Inventarios]
 *     responses:
 *       200:
 *         description: Una lista de inventarios
 *       500:
 *         description: Error al obtener los inventarios
 */
router.get('/get-inventarios', async (req, res) => {
    try {
        const inventarios = await obtenerInventarios();
        res.status(200).json(inventarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});                                                                          

/**
 * @swagger
 * /api/i/inventarios-by-id/{id}:
 *   get:
 *     summary: Obtener un inventario por ID
 *     tags: [Inventarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del inventario a obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inventario encontrado
 *       404:
 *         description: Inventario no encontrado
 */
router.get('/inventarios-by-id/:id', async (req, res) => {
    const { id } = req.params; 
    try {
        const inventario = await obtenerInventarioById(id); 
        res.status(200).json(inventario);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/i/edit-inventarios/{id}:
 *   put:
 *     summary: Actualizar un inventario
 *     tags: [Inventarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del inventario a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               last_review:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Inventario actualizado con éxito
 *       404:
 *         description: Inventario no encontrado
 */
router.put('/edit-inventarios/:id', async (req, res) => {
    const { id } = req.params; 
    const data = req.body; 
    try {
        const inventarioActualizado = await actualizarInventario(id, data); 
        res.status(200).json(inventarioActualizado);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/i/del-inventarios/{id}:
 *   delete:
 *     summary: Eliminar un inventario
 *     tags: [Inventarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del inventario a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Inventario eliminado con éxito
 *       404:
 *         description: Inventario no encontrado
 */
router.delete('/del-inventarios/:id', async (req, res) => {
    const { id } = req.params; 
    try {
        await eliminarInventario(id); 
        res.status(204).send(); 
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router;