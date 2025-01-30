const express = require('express');
const router = express.Router();
const {
    crearUnidad,
    obtenerUnidades,
    obtenerUnidadById,
    actualizarUnidad,
    eliminarUnidad,
    prodByUnid,
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

/**
 * @swagger
 * /api/u/get-prodByUnid/{id}:
 *   get:
 *     summary: Obtener productos por ID de unidad
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la unidad para obtener los productos asociados
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Productos obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID del producto
 *                   cod_ub:
 *                     type: string
 *                     description: Código de ubicación del producto
 *                   cod_prod:
 *                     type: string
 *                     description: Código del producto
 *                   desc_prod:
 *                     type: string
 *                     description: Descripción del producto
 *                   h_much:
 *                     type: integer
 *                     description: Cantidad del producto
 *                   unit:
 *                     type: string
 *                     description: Unidad de medida del producto
 *                   price:
 *                     type: number
 *                     format: float
 *                     description: Precio del producto
 *                   url_imagen:
 *                     type: string
 *                     description: URL de la imagen del producto
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha de creación del producto
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha de actualización del producto
 *                   deletedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha de eliminación del producto (si aplica)
 *       404:
 *         description: No se encontraron productos para la unidad especificada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error
 */
router.get ('/get-prodByUnid/:id', async (req, res) => {
    const { id } = req.params; 
    try {
        const prod = await prodByUnid(id); 
        res.status(200).json(prod); 
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router;