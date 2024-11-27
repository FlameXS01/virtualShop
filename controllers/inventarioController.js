const Storage = require('../models/inventario'); 

// Controlador para crear un nuevo inventario
const crearInventario = async (req, res) => {
    const { last_review, unity_id } = req.body; 
    try {
        const nuevoInventario = await Storage.create({ last_review, unity_id });
        res.status(201).json(nuevoInventario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el inventario' });
    }
};

// Controlador para obtener todos los almacenamientos
const obtenerInventarios = async (req, res) => {
    try {
        const inventarios = await Storage.findAll();
        res.status(200).json(inventarios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los inventarios' });
    }
};

// Controlador para obtener un almacenamiento por ID
const obtenerInventarioById = async (id) => {
    try {
        const inventarios = await Storage.findByPk(id);
        if (!inventarios) {
            throw new Error('Inventario no encontrado');
        }
        return inventario;
    } catch (error) {
        throw error;
    }
};

// Controlador para actualizar un almacenamiento
const actualizarInventario = async (id, data) => {
    try {
        const inventario = await Storage.findByPk(id);
        if (!inventario) {
            throw new Error('Inventario no encontrado');
        }
        await inventario.update(data);
        return inventario;
    } catch (error) {
        throw error;
    }
};

// Controlador para eliminar un almacenamiento
const eliminarInventario = async (id) => {
    try {
        const inventario = await Storage.findByPk(id);
        if (!inventario) {
            throw new Error('Inventario no encontrado');
        }
        await inventario.destroy();
    } catch (error) {
        throw error;
    }
};

module.exports = {
    crearInventario,
    obtenerInventarios,
    obtenerInventarioById,
    actualizarInventario,
    eliminarInventario,
};