const express = require('express');
const router = express.Router();
const {
    crearLocalidad,
    obtenerLocalidades,
    obtenerLocalidadById,
    actualizarLocalidad,
    eliminarLocalidad,
} = require('../controllers/localidadController'); 

/**
 * @swagger
 * tags:
 *   name: Localidades
 *   description: API para gestionar localidades
 */

/**
 * @swagger
 * /api/l/add-localidades:
 *   post:
 *     summary: Crear una nueva localidad
 *     tags: [Localidades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               loc_cod:
 *                 type: string
 *               loc_name:
 *                 type: string
 *               unity_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Localidad creada con éxito
 *       500:
 *         description: Error al crear la localidad
 */
router.post('/add-localidades', async (req, res) => {
    try {
        const nuevaLocalidad = await crearLocalidad(req.body); 
        res.status(201).json(nuevaLocalidad);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/l/get-localidades:
 *   get:
 *     summary: Obtener todas las localidades
 *     tags: [Localidades]
 *     responses:
 *       200:
 *         description: Una lista de localidades
 *       500:
 *         description: Error al obtener las localidades
 */
router.get('/get-localidades', async (req, res) => {
    try {
        const localidades = await obtenerLocalidades();
        res.status(200).json(localidades);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});                                                                          

/**
 * @swagger
 * /api/l/localidades-by-id/{id}:
 *   get:
 *     summary: Obtener una localidad por ID
 *     tags: [Localidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la localidad a obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Localidad encontrada
 *       404:
 *         description: Localidad no encontrada
 */
router.get('/localidades-by-id/:id', async (req, res) => {
    const { id } = req.params; 
    try {
        const localidad = await obtenerLocalidadById(id); 
        res.status(200).json(localidad);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/l/edit-localidades/{id}:
 *   put:
 *     summary: Actualizar una localidad
 *     tags: [Localidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la localidad a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               loc_cod:
 *                 type: string
 *               loc_name:
 *                 type: string
 *               unity_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Localidad actualizada con éxito
 *       404:
 *         description: Localidad no encontrada
 */
router.put('/edit-localidades/:id', async (req, res) => {
    const { id } = req.params; 
    const data = req.body; 
    try {
        const localidadActualizada = await actualizarLocalidad(id, data); 
        res.status(200).json(localidadActualizada);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/l/del-localidades/{id}:
 *   delete:
 *     summary: Eliminar una localidad
 *     tags: [Localidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la localidad a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Localidad eliminada con éxito
 *       404:
 *         description: Localidad no *         encontrada
 */
router.delete('/del-localidades/:id', async (req, res) => {
    const { id } = req.params; 
    try {
        await eliminarLocalidad(id); 
        res.status(204).send(); 
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router;