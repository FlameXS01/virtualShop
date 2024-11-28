const Request = require('../models/request'); 
const Product = require('../models/product'); 

// Crear una nueva solicitud
async function crearSolicitud(data) {
    const nuevaSolicitud = await Request.create(data);
    return nuevaSolicitud;
}

// Obtener todas las solicitudes
async function obtenerSolicitudes() {
    return await Request.findAll({
        include: Product // Incluye los productos relacionados
    });
}

// Obtener una solicitud por ID
async function obtenerSolicitudById(id) {
    const solicitud = await Request.findByPk(id, {
        include: Product // Incluye los productos relacionados
    });
    if (!solicitud) {
        throw new Error('Solicitud no encontrada');
    }
    return solicitud;
}

// Actualizar una solicitud
async function actualizarSolicitud(id, data) {
    const solicitud = await Request.findByPk(id);
    if (solicitud) {
        return await solicitud.update(data);
    }
    return null;
}

// Eliminar una solicitud
async function eliminarSolicitud(id) {
    const solicitudEliminada = await Request.destroy({
        where: { id },
    });
    if (!solicitudEliminada) {
        throw new Error('Solicitud no encontrada');
    }
}

module.exports = {
    crearSolicitud,
    obtenerSolicitudes,
    obtenerSolicitudById,
    actualizarSolicitud,
    eliminarSolicitud,
};