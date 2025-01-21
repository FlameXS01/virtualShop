const User = require('../models/user'); // Asegúrate de importar tu modelo User
const bcrypt = require('bcryptjs'); // Asegúrate de importar bcryptjs
const jwt = require('jsonwebtoken'); // Asegúrate de importar jsonwebtoken

// Crear un nuevo usuario
async function crearUsuario(data) {
    // Almacena el nuevo usuario en la base de datos
    const nuevoUsuario = await User.create(data);
    return nuevoUsuario;
}


// Función para iniciar sesión
async function iniciarSesion(email, password) {
    // Buscar el usuario por email
    const usuario = await User.findOne({ where: { email } });
    
    if (!usuario) {
        throw new Error('Usuario no encontraaaaaaaado');
    }
    
                
    // Comparar la contraseña hasheada con la contraseña de entrada
    const contrasenaValida = await bcrypt.compare(password, usuario.password);
    if (!contrasenaValida) {
        throw new Error('Contraseña incorrecta');
    }

    // Generar el token JWT
    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Generar el token de refresh
    const refreshToken = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET_REFRESH, { expiresIn: '7d' });

    // Retornar los tokens
    console.log("todo chill de cojones")
    return {
        token,
        refreshToken,
        usuario: {
            id: usuario.id,
            email: usuario.email,
            phone_number: usuario.phone_number,
            username: usuario.username,
            rol: usuario.rol,
        },
    };
}


// Obtener todos los usuarios
async function obtenerUsuarios() {
    return await User.findAll();
}

// Obtener un usuario por ID
async function obtenerUsuarioById(id) {
    const usuario = await User.findByPk(id);
    if (!usuario) {
        throw new Error('Usuario no encontrado');
    }
    return usuario;
}

// Actualizar un usuario
async function actualizarUsuario(id, data) {
    const usuario = await User.findByPk(id);
    if (usuario) {
        // Si se proporciona una nueva contraseña, encriptarla
        if (data.password) {
            const salt = await bcrypt.genSalt(10);
            data.password = await bcrypt.hash(data.password, salt);
        }
        return await usuario.update(data);
    }
    throw new Error('Usuario no encontrado');
}

// Eliminar un usuario
async function eliminarUsuario(id) {
    const usuarioEliminado = await User.destroy({
        where: { id },
    });
    if (!usuarioEliminado) {
        throw new Error('Usuario no encontrado');
    }
}

module.exports = {
    crearUsuario,
    obtenerUsuarios,
    obtenerUsuarioById,
    actualizarUsuario,
    eliminarUsuario,
    iniciarSesion,
};