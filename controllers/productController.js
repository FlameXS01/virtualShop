const Product = require('../models/product'); 

// Crear un nuevo producto
async function crearProducto(data) {
    const nuevoProducto = await Product.create(data);
    // Si tienes IDs de unidades que deseas asociar, puedes hacer algo como esto:
    if (data.unityIds && data.unityIds.length > 0) {
        await nuevoProducto.addUnities(data.unityIds); // Esto establece la relación
    }


    return nuevoProducto;

}

// Obtener todos los productos
async function obtenerProductos() {
    return await Product.findAll();
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