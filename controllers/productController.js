const Product = require('../models/product'); 
const Unity = require("../models/unidad");
const path = require('path');
const deleteFile  = require('../utils/fileUtils');

// Crear un nuevo producto
async function crearProducto(data, unityIds) {

    const nuevoProducto = await Product.create(data);
    //console.log(Object.keys(nuevoProducto.__proto__));
    
    if (unityIds && unityIds.length > 0) {
        const unidadesEncontradas = await Unity.findAll({
            where: {
                id: unityIds,
            },
        });
        await nuevoProducto.addUnity(unidadesEncontradas);
    }
    return nuevoProducto;
}

// Obtener todos los productos
async function obtenerProductos() {
    const productos = await Product.findAll();
        return productos;
}

// Obtener un producto por ID
async function obtenerProductoById(id) {
    const producto = await Product.findByPk(id);
    if (!producto) {
        throw new Error('Producto no encontrado');
    }
    return producto;
}

// Actualizar un producto
async function actualizarProducto(id, data) {
    const producto = await Product.findByPk(id);
    if (producto) {
        return await producto.update(data);
    }
    return null;
}

// Eliminar un producto
async function eliminarProducto(id) {
    const producto = await Product.findByPk(productId);
    
    //Eliminar la imagen si existe
    if (producto.url_imagen) {        
        const imagePath = path.join(
            __dirname, '..', 
            'public', 'images', 'products', 
            producto.url_imagen
        );
        try {
            await deleteFile(imagePath);
        } catch (error) {
            console.error('Error eliminando imagen:', error.message);
        }
    }
    await producto.destroy();    
    return true;

}

async function eliminarProductoInUnid(productId, unityId) {
    const producto = await Product.findByPk(productId);
    if (!producto) {
        throw new Error('Producto no encontrado');
    }
    await producto.removeUnity(unityId); 
    //console.log(`Relación eliminada: Producto ${productId} de Unidad ${unityId}`);
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProductoById,
    actualizarProducto,
    eliminarProducto,
    eliminarProductoInUnid
};