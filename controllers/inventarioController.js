const Inventario = require('../models/Inventario'); 

// Crear un nuevo inventario
async function crearInventario(data) {
    const nuevoInventario = await Inventario.create(data);
    return nuevoInventario;
}

// Obtener todos los inventarios
async function obtenerInventarios() {
    return await Inventario.findAll();
}

// Obtener un inventario por ID
async function obtenerInventarioById(id) {
    const inventario = await Inventario.findByPk(id);
    if (!inventario) {
        throw new Error('Inventario no encontrado');
    }
    return inventario;
}

// Actualizar un inventario
async function actualizarInventario(id, data) {
    const inventario = await Inventario.findByPk(id);
    if (inventario) {
        return await inventario.update(data);
    }
    return null; 
}

// Eliminar un inventario
async function eliminarInventario(id) {
    const inventarioEliminado = await Inventario.destroy({
        where: { id },
    });
    if (!inventarioEliminado) {
        throw new Error('Inventario no encontrado');
    }
}

module.exports = {
    crearInventario,
    obtenerInventarios,
    obtenerInventarioById,
    actualizarInventario,
    eliminarInventario,
};