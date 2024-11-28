const express = require('express');
const router = express.Router();
const {
    crearUnidad,
    obtenerUnidades,
    obtenerUnidadById,
    actualizarUnidad,
    eliminarUnidad,
} = require('../controllers/unidadController'); 

/**
 * @swagger
 * tags:
 *   name: Unidades
 *   description: API para gestionar unidades
 */

/**
 * @swagger
 * /api/u/add-unidades:
 *   post:
 *     summary: Crear una nueva unidad
 *     tags: [Unidades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               unity_name:
 *                 type: string
 *               complex:
 *                 type: string
 *               cost_center:
 *                 type: string
 *     responses:
 *       201:
 *         description: Unidad creada con éxito
 *       500:
 *         description: Error al crear la unidad
 */
router.post('/add-unidades', async (req, res) => {
    try {
        const nuevaUnity = await crearUnidad(req.body); 
        res.status(201).json(nuevaUnity);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/u/get-unidades:
 *   get:
 *     summary: Obtener todas las unidades
 *     tags: [Unidades]
 *     responses:
 *       200:
 *         description: Una lista de unidades
 *       500:
 *         description: Error al obtener las unidades
 */
router.get('/get-unidades', async (req, res) => {
    try {
        const unidades = await obtenerUnidades();
        res.status(200).json(unidades);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});                                                                          

/**
 * @swagger
 * /api/u/unidades-by-id/{id}:
 *   get:
 *     summary: Obtener una unidad por ID
 *     tags: [Unidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la unidad a obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Unidad encontrada
 *       404:
 *         description: Unidad no encontrada
 */
router.get('/unidades-by-id/:id', async (req, res) => {
    const { id } = req.params; 
    try {
        const unity = await obtenerUnidadById(id); 
        res.status(200).json(unity);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/u/edit-unidades/{id}:
 *   put:
 *     summary: Actualizar una unidad
 *     tags: [Unidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la unidad a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               unity_name:
 *                 type: string
 *               complex:
 *                 type: string
 *               cost_center:
 *                 type: string
 *     responses:
 *       200:
 *         description: Unidad actualizada con éxito
 *       404:
 *         description: Unidad no encontrada
 */
router.put('/edit-unidades/:id', async (req, res) => {
    const { id } = req.params; 
    const data = req.body; 
    try {
        const unityActualizada = await actualizarUnidad(id, data); 
        res.status(200).json(unityActualizada);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/u/del-unidades/{id}:
 *   delete:
 *     summary: Eliminar una unidad
 *     tags: [Unidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la unidad a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Unidad eliminada con éxito
 *       404:
 *         description: Unidad no encontrada
 */
router.delete ('/del-unidades/:id', async (req, res) => {
    const { id } = req.params; 
    try {
        await eliminarUnidad(id); 
        res.status(204).send(); 
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router;