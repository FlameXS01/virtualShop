const User = require('../models/user'); 
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const path = require('path');
const deleteFile  = require('../utils/fileUtils');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// Crear un nuevo usuario
async function crearUsuario(data) {
    try {
        const nuevoUsuario = await User.create(data);
        return {
            success: true,
            user: nuevoUsuario,
            message: 'Usuario registrado correctamente'
        };
    } catch (error) {
        console.error('Error al crear usuario:');
        console.error('Nombre del error:', error.name);
        console.error('Mensaje del error:', error.message);
        
        // Si es un error de validación de Sequelize
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            console.error('Errores de validación:', error.errors.map(e => ({
                campo: e.path,
                mensaje: e.message
            })));
            
            return {
                success: false,
                message: 'Error de validación',
                errors: error.errors.map(e => ({
                    campo: e.path,
                    mensaje: e.message
                }))
            };
        }
        
        // Para otros tipos de errores
        console.error('Stack trace:', error.stack);
        return {
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        };
    }
}


// Función para iniciar sesión
async function iniciarSesion(email, password) {
    try {
        // Buscar el usuario por email
        console.log(email,  password);
        const usuario = await User.findOne({ where: { email } });
        
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }
        
        // Comparar la contraseña hasheada con la contraseña de entrada
        const contrasenaValida = await bcrypt.compare(password, usuario.password);
        if (!contrasenaValida) {
            throw new Error('Contraseña incorrecta');
        }
        
        // Generar el token JWT
        const accessToken = jwt.sign(
            { 
                id: usuario.id,
                email: usuario.email,
                phone_number: usuario.phone_number,
                rol: usuario.rol,
                username: usuario.username,
            }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const refreshToken = jwt.sign(
            {   
                id: usuario.id,
                email: usuario.email,
                phone_number: usuario.phone_number,
                rol: usuario.rol,
                username: usuario.username,
            }, process.env.JWT_SECRET_REFRESH, { expiresIn: '1d' });        
        
        // Retornar los tokens
        return { accessToken, refreshToken  };
    } catch (error) {
        throw error; // Vuelve a lanzar el error para que pueda ser manejado por el llamador
    }
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
    const usuario = await User.findByPk(id);
    
    //Eliminar la imagen si existe
    if (usuario.url_imagen) {        
        const imagePath = path.join(
            __dirname, '..', 
            'public', 'images', 'user', 
            usuario.url_imagen
        );
        try {
            await deleteFile(imagePath);
        } catch (error) {
            console.error('Error eliminando imagen:', error.message);
        }
    }
    await usuario.destroy();    
    return true;
}

////////////////////
async function obtenerPerfilUsuario(id) {
    const usuario = await User.findByPk(id, {
        attributes: { exclude: ['password'] }, 
    });
    
    if (!usuario) {
        throw new Error('Usuario no encontrado');
    }
    
    return usuario;
}
async function verifyTwoFactorToken(userId, code) {
    const usuario = await User.findByPk(userId);
    if (!usuario) throw new Error('Usuario no encontrado');
    if (!usuario.twoFactorSecret) throw new Error('2FA no configurado');

    console.log('[DEBUG] Secret en BD:', usuario.twoFactorSecret); // 

    console.log('[DEBUG] Código recibido:', code); // 

    const currentCode = speakeasy.totp({

        secret: usuario.twoFactorSecret,
    
        encoding: 'base32'
    
    });
    
    console.log('[DEBUG] Código esperado:', currentCode); 

    const isValid = speakeasy.totp.verify({
        secret: usuario.twoFactorSecret,
        encoding: 'base32',
        token: code,
        window: 1 
    });
    if (!isValid) throw new Error('Código inválido');
    if (!usuario.twoFactorEnabled) {
        await usuario.update({ twoFactorEnabled: true });
    }
    return { success: true };
}

async function validateTwoFactorToken(userId, code){
    const usuario = await User.findByPk(userId);
    if (!usuario.twoFactorEnabled){
        throw new Error ('No tiene 2fa habilitado');
    }
    const isValid = speakeasy.totp.verify({
        secret: usuario.twoFactorSecret,
        encoding:'base32',
        token: code
    });
    if(!isValid){
        throw new Error ('No tiene 2fa habilitado, not valid');
    }
    return {success: true};
}

async function genTwoFactor(userId) {
    try{
        const user = await User.findByPk(userId);
        if(!user){
            throw new Error('usuario no encontrado');
        }
        const secret = speakeasy.generateSecret({
            name:`Virtual Rt:${user.email}`,
            length: 20
        });
        await user.update({twoFactorSecret: secret.base32});
        const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
        return {
            secret: secret.base32,
            qrCode: qrCodeUrl
        };
        
    } catch (error) {
        console.error('Error creando el 2fa:', error);
        throw error;
    }    
}
async function invalidarRefreshToken(userId) {
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            console.log('Usuario no encontrado:' , userId);
            return null;
        }
        user.refreshToken = null;
        await user.save();
        
        return user;
        
    } catch (error) {
        console.error('Error al cerrar sesion:', error);
        throw error; // Opcional: relanzar el error para manejo superior
    }
}



module.exports = {
    crearUsuario,
    obtenerUsuarios,
    obtenerUsuarioById,
    actualizarUsuario,
    eliminarUsuario,
    iniciarSesion,
    obtenerPerfilUsuario,
    invalidarRefreshToken, 
    genTwoFactor, 
    verifyTwoFactorToken,
    validateTwoFactorToken
};