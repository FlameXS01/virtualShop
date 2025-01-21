const Unity = require('../models/unidad'); 
const Product = require('../models/product'); 

// Crear una nueva unidad
async function crearUnidad(data) {
    const nuevaUnidad = await Unity.create(data);
    return nuevaUnidad;
}

// Obtener todas las unidades
async function obtenerUnidades() {
    return await Unity.findAll({include: Product});
}

// Obtener una unidad por ID
async function obtenerUnidadById(id) {
    const unidad = await Unity.findByPk(id, {
        include: Product // Incluye los productos relacionados
    });
    if (!unidad) {
        throw new Error('Unidad no encontrada');
    }
    return unidad;
}

// Actualizar una unidad
async function actualizarUnidad(id, data) {
    const unidad = await Unity.findByPk(id);
    if (unidad){
        return await unidad.update(data);
    }
    return null;
}

// Eliminar una unidad
async function eliminarUnidad(id) {
    const unidadEliminada = await Unity.destroy({
        where: { id },
    });
    if (!unidadEliminada) {
        throw new Error('Unidad no encontrada');
    }
}

module.exports = {
    crearUnidad,
    obtenerUnidades,
    obtenerUnidadById,
    actualizarUnidad,
    eliminarUnidad,
};