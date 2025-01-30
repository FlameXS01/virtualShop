const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const { upload } = require("../config/multerConfig");
const  deleteFile  = require('../utils/fileUtils');
const path = require('path');

const {
    crearUsuario,
    obtenerUsuarios,
    obtenerUsuarioById,
    actualizarUsuario,
    eliminarUsuario,
    iniciarSesion,
    obtenerPerfilUsuario,
    invalidarRefreshToken,
} = require('../controllers/userController'); // Asegúrate de tener un controlador para el modelo User

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: API para gestionar usuarios
 */

/**
 * @swagger
 * /api/user/add-usuario:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               rol:
 *                 type: string
 *                 enum: [usuario, administrador]
 *     responses:
 *       201:
 *         description: Usuario creado con éxito
 *       500:
 *         description: Error al crear el usuario
 */
router.post('/add-usuario', upload.single("imagen"), async (req, res) => {
    try {
        // Debes usar el nombre correcto del campo de la imagen
        if (req.file) {
            req.body.url_imagen = req.file.filename;
        }
        
        // Validación básica de campos requeridos
        if (!req.body.username || !req.body.email) {
            if (req.file) deleteFile(req.file.path); // Implementa esta función
            return res.status(400).json({ error: "Usuario y email son requeridos" });
        }

        const nuevoUsuario = await crearUsuario(req.body);
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        if (req.file) deleteFile(req.file.path);
        res.status(500).json({ error: error.message });
    }
});
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API para la autenticación de usuarios
 */

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: mySecurePassword
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 refreshToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     nombre:
 *                       type: string
 *                       example: "John Doe"
 *       400:
 *         description: Error en la autenticación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario no encontrado" # o "Contraseña incorrecta"
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const {accessToken , refreshToken} = await iniciarSesion(email, password);
        res.status(200).json({accessToken, refreshToken});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
/**
 * @swagger
 * /api/user/get-usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Una lista de usuarios
 *       500:
 *         description: Error al obtener los usuarios
 */
router.get('/get-usuarios', async (req, res) => {
    try {
        const usuarios = await obtenerUsuarios();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/user/usuario-by-id/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/usuario-by-id/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await obtenerUsuarioById(id);
        res.status(200).json(usuario);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/user/edit-usuario/{id}:
 *   put:
 *     summary: Actualizar un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado con éxito
 *       404:
 *         description: Usuario no encontrado
 */
router.put('/edit-usuario/:id', upload.single("imagen"), async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    
    try {
        // 1. Obtener usuario existente
        const usuarioExistente = await obtenerUsuarioById(id);
        if (!usuarioExistente) {
            if (req.file) {
                deleteFile(req.file.path);
            }
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        if (req.file) {
            data.url_imagen = req.file.filename;            
            if (usuarioExistente.url_imagen) {
                deleteFile(path.join(__dirname, '..', 'public', 'images', 'user', usuarioExistente.url_imagen));
            }
        }
        const usuarioActualizado = await actualizarUsuario(id, data);        
        res.status(200).json(usuarioActualizado);
    } catch (error) {
        if (req.file) {
            deleteFile(req.file.path);
        }
        res.status(500).json({ 
            error: error.message || 'Error al actualizar el usuario' 
        });
    }
});

/**
 * @swagger
 * /api/user/del-usuario/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Usuario eliminado con éxito
 *       404:
 *         description: Usuario no encontrado
 */
router.delete('/del-usuario/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await eliminarUsuario(id);
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/////////////////////
/**
 * @swagger
 * /api/user/me:
 *   get:
 *     summary: Obtener el perfil de un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Perfil del usuario obtenido con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID del usuario
 *                 email:
 *                   type: string
 *                   description: Correo electrónico del usuario
 *                 phone_number:
 *                   type: string
 *                   description: Número de teléfono del usuario
 *                 rol:
 *                   type: string
 *                   description: Rol del usuario
 *                 username:
 *                   type: string
 *                   description: Nombre de usuario
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/me", authenticate(["administrador", "usuario"]), async (req, res, next) => {

    try {
        const usuario = await obtenerPerfilUsuario(req.userData.id);

        res.status(200).json(usuario);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /api/user/logout:
 *   post:
 *     summary: Cerrar sesión
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente
 *       401:
 *         description: No autorizado (token no proporcionado o inválido)
 *       500:
 *         description: Error interno del servidor
 */
router.post("/logout", authenticate(["administrador", "usuario"]), async (req, res, next) => {
    try {
        await invalidarRefreshToken(req.userData.id);
        res.status(200).json({ message: 'Sesión cerrada exitosamente' });
    } catch (error) {
        next(error);
    }
});

router.get("/imagen/:filename", (req, res, next) => {
    try {
        const filename = req.params.filename;
        const imagePath = path.join(__dirname, '..', 'public','images', 'user', filename);
        res.sendFile(imagePath);
    } catch (error) {
        next(error);
    }
});

module.exports = router;