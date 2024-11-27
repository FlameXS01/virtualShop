const Product = require('../models/product'); 

// Controlador para crear un nuevo Producto
const crearProduct = async (req, res) => {
    const { last_review, unity_id } = req; 
    try {
        const nuevoProducto = await Product.create({ last_review, unity_id });
        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el Producto' });
    }
};

// Controlador para obtener todos los Productos
const obtenerProductos = async (req, res) => {
    try {
        const productos = await Product.findAll();
        res.status(200).json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los Productos' });
    }
};

// Controlador para obtener un Producto por ID
const obtenerProductoById = async (id) => {
    try {
        const producto = await Product.findByPk(id);
        if (!producto) {
            throw new Error('Producto no encontrado');
        }
        return producto;
    } catch (error) {
        throw error;
    }
};

// Controlador para actualizar un Producto
const actualizarProducto = async (id, data) => {
    try {
        const producto = await Product.findByPk(id);
        if (!producto) {
            throw new Error('Producto no encontrado');
        }
        await producto.update(data);
        return producto;
    } catch (error) {
        throw error;
    }
};

// Controlador para eliminar un Producto
const eliminarProducto = async (id) => {
    try {
        const producto = await Product.findByPk(id);
        if (!producto) {
            throw new Error('Producto no encontrado');
        }
        await producto.destroy();
    } catch (error) {
        throw error;
    }
};

module.exports = {
    crearProducto,
    obtenerProducto,
    obtenerProductoById,
    actualizarProducto,
    eliminarProducto,
};