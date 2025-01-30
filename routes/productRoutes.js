const express = require('express');
const router = express.Router();
const path = require('path');
const deleteFile  = require('../utils/fileUtils');
const { uploadProducts } = require('../config/multerProducts');
const {
    crearProducto,
    obtenerProductos,
    obtenerProductoById,
    actualizarProducto,
    eliminarProducto,
    eliminarProductoInUnid
} = require('../controllers/productController'); 
const { obtenerInventarioById } = require('../controllers/inventarioController');

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
 *                 type: string
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
router.post('/add-productos',  uploadProducts.single('imagen'), async (req, res) => {
    try {
        if (req.file) {
            req.body.url_imagen = req.file.filename;
        }
        const  {cod_ub, cod_prod, desc_prod, h_much, unit, price, url_imagen, unityIds} = req.body;
        //console.log(url_imagen);
        const nuevoProducto = await crearProducto(
            {cod_ub, cod_prod, desc_prod, h_much, unit, price, url_imagen}, 
            unityIds
        ); 
        res.status(201).json(nuevoProducto);
    } catch (error) {
        if (req.file) deleteFile(req.file.path);
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
router.put('/edit-productos/:id', uploadProducts.single('imagen'), async (req, res) => {
    const { id } = req.params; 
    const data = req.body; 
    try {
        const producto = await obtenerProductoById(id);
        if (!producto) {
            if (req.file) {
                deleteFile(req.file.path);
            }
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        if (req.file) {
            data.url_imagen = req.file.filename;            
            if (producto.url_imagen) {
                deleteFile(path.join(__dirname, '..', 'public', 'images', 'products', producto  .url_imagen));
            }
        }
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
/**
 * @swagger
 * /api/p/del-productos/{idP}:
 *   delete:
 *     summary: Eliminar un producto de una Unidad
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: idP
 *         required: true
 *         description: ID del producto a eliminar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idU:
 *                 type: string
 *                 description: ID de la unidad de la que se eliminará el producto
 *     responses:
 *       204:
 *         description: Producto eliminado con éxito
 *       404:
 *         description: Producto no encontrado
 */
router.delete('/del-productosInUnity/:idP', async (req, res) => {
    const { idP } = req.params; 
    const { idU } = req.body; // Obtener el ID de la unidad del cuerpo de la solicitud
    try {
        await eliminarProductoInUnid(idP, idU); // Asegúrate de que la función eliminarProducto acepte ambos IDs
        res.status(204).send(); 
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});


///////////////////////////////////////

router.get("/imagen/:filename", (req, res, next) => {
    try {
        const filename = req.params.filename;
        const imagePath = path.join(__dirname, '..', 'public','images', 'products', filename);
        res.sendFile(imagePath);
    } catch (error) {
        next(error);
    }
});

module.exports = router;  