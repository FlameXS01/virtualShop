const express = require('express');
const router = express.Router();
const {
    crearProducto,
    obtenerProductos,
    obtenerProductoById,
    actualizarProducto,
    eliminarProducto,
} = require('../controllers/productController'); 

/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: API para gestionar productos
 */

/**
 * @swagger
 * /api/p/add-productos:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cod_ub:
 *                 type: string
 *               cod_prod:
 *                 type: string
 *               desc_prod:
 *                 type: string
 *               h_much:
 *                 type: integer
 *               unit:
 *                 type: integer
 *               price:
 *                 type: integer
 *               unityIds:  
 *                 type: array
 *                 items:
 *                   type: integer
 *                   description: IDs de las unidades a asociar con el producto
 *     responses:
 *       201:
 *         description: Producto creado con éxito
 *       500:
 *         description: Error al crear el producto
 */
router.post('/add-productos', async (req, res) => {
    try {
        const  {cod_ub, cod_prod, desc_prod, h_much, unit, price, unityIds} = req.body;
        const nuevoProducto = await crearProducto(
            {cod_ub, cod_prod, desc_prod, h_much, unit, price}, 
            unityIds
        ); 
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/p/get-productos:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Una lista de productos
 *       500:
 *         description: Error al obtener los productos
 */
router.get('/get-productos', async (req, res) => {
    try {
        const productos = await obtenerProductos();
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});                                                                          

/**
 * @swagger
 * /api/p/productos-by-id/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto a obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       404:
 *         description: Producto no encontrado
 */
router.get('/productos-by-id/:id', async (req, res) => {
    const { id } = req.params; 
    try {
        const producto = await obtenerProductoById(id); 
        res.status(200).json(producto);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/p/edit-productos/{id}:
 *   put:
 *     summary: Actualizar un producto
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cod_ub:
 *                 type: string
 *               cod_prod:
 *                 type: string
 *               desc_prod:
 *                 type: string
 *               h_much:
 *                 type: integer
 *               unit:
 *                 type: integer
 *               price:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Producto actualizado con éxito
 *       404:
 *         description: Producto no encontrado
 */
router.put('/edit-productos/:id', async (req, res) => {
    const { id } = req.params; 
    const data = req.body; 
    try {
        const productoActualizado = await actualizarProducto(id, data); 
        res.status(200).json(productoActualizado);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/p/del-productos/{id}:
 *   delete:
 *     summary: Eliminar un producto
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Producto eliminado con éxito
 *       404:
 *         description: Producto no encontrado
 */
router.delete('/del-productos/:id', async (req, res) => {
    const { id } = req.params; 
    try {
        await eliminarProducto(id); 
        res.status(204).send(); 
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router;