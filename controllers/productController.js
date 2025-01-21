const Product = require('../models/product'); 
const Unity = require("../models/unidad");

// Crear un nuevo producto
async function crearProducto(data, unityIds) {

    const nuevoProducto = await Product.create(data);
    console.log(Object.keys(nuevoProducto.__proto__));
    
    // Si tienes IDs de unidades que deseas asociar, puedes hacer algo como esto:
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
    const productoEliminado = await Product.destroy({
        where: { id },
    });
    if (!productoEliminado) {
        throw new Error('Producto no encontrado');
    }
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProductoById,
    actualizarProducto,
    eliminarProducto,
};