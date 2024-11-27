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
async function obtenerInventarioPorId(id) {
    const inventario = await Inventario.findByPk(id);
    if (!inventario) {
        throw new Error('Inventario no encontrado');
    }
    return inventario;
}

// Actualizar un inventario
async function actualizarInventario(id, data) {
    const [numeroFilasActualizadas, [inventarioActualizado]] = await Inventario.update(data, {
        where: { id },
        returning: true,
    });
    if (numeroFilasActualizadas === 0) {
        throw new Error('Inventario no encontrado');
    }
    return inventarioActualizado;
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
    obtenerInventarioPorId,
    actualizarInventario,
    eliminarInventario,
};