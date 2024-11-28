const Locality = require('../models/localidad'); 

// Crear una nueva localidad
async function crearLocalidad(data) {
    const nuevaLocalidad = await Locality.create(data);
    return nuevaLocalidad;
}

// Obtener todas las localidades
async function obtenerLocalidades() {
    return await Locality.findAll();
}

// Obtener una localidad por ID
async function obtenerLocalidadById(id) {
    const localidad = await Locality.findByPk(id);
    if (!localidad) {
        throw new Error('Localidad no encontrada');
    }
    return localidad;
}

// Actualizar una localidad
async function actualizarLocalidad(id, data) {
    const localidad = await Locality.findByPk(id);
    if (localidad) {
        return await localidad.update(data);
    }
    return null;

}

// Eliminar una localidad
async function eliminarLocalidad(id) {
    const localidadEliminada = await Locality.destroy({
        where: { id },
    });
    if (!localidadEliminada) {
        throw new Error('Localidad no encontrada');
    }
}

module.exports = {
    crearLocalidad,
    obtenerLocalidades,
    obtenerLocalidadById,
    actualizarLocalidad,
    eliminarLocalidad,
};