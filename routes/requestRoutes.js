const express = require('express');
const router = express.Router();
const {
    crearSolicitud,
    obtenerSolicitudes,
    obtenerSolicitudById,
    actualizarSolicitud,
    eliminarSolicitu,
} = require('../controllers/requestController'); 

/**
 * @swagger
 * tags:
 *   name: Requests
 *   description: API para gestionar solicitudes
 */

/**
 * @swagger
 * /api/r/add-requests:
 *   post:
 *     summary: Crear una nueva solicitud
 *     tags: [Requests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               request_date:
 *                 type: string
 *               unity_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Solicitud creada con éxito
 *       500:
 *         description: Error al crear la solicitud
 */
router.post('/add-requests', async (req, res) => {
    try {
        const nuevaRequest = await crearSolicitud(req.body); 
        res.status(201).json(nuevaRequest);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/r/get-requests:
 *   get:
 *     summary: Obtener todas las solicitudes
 *     tags: [Requests]
 *     responses:
 *       200:
 *         description: Una lista de solicitudes
 *       500:
 *         description: Error al obtener las solicitudes
 */
router.get('/get-requests', async (req, res) => {
    try {
        const requests = await obtenerSolicitudes();
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});                                                                          

/**
 * @swagger
 * /api/r/requests-by-id/{id}:
 *   get:
 *     summary: Obtener una solicitud por ID
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la solicitud a obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Solicitud encontrada
 *       404:
 *         description: Solicitud no encontrada
 */
router.get('/requests-by-id/:id', async (req, res) => {
    const { id } = req.params; 
    try {
        const request = await obtenerSolicitudById(id); 
        res.status(200).json(request);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/r/edit-requests/{id}:
 *   put:
 *     summary: Actualizar una solicitud
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la solicitud a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               request_date:
 *                 type: string
 *               unity_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Solicitud actualizada con éxito
 *       404:
 *         description: Solicitud no encontrada
 */
router.put('/edit-requests/:id', async (req, res) => {
    const { id } = req.params; 
    const data = req.body; 
    try {
        const requestActualizada = await actualizarSolicitud(id, data); 
        res.status(200).json(requestActualizada);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/r/del-requests/{id}:
 *   delete:
 *     summary: Eliminar una solicitud
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la solicitud a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Solicitud eliminada con éxito
 *       404:
 *         description: Solicitud no encontrada
 */
router.delete('/del-requests/:id', async (req, res) => {
    const { id } = req.params; 
    try {
        await eliminarSolicitu(id); 
        res.status(204).send(); 
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router;