const express = require('express');
const sequelize = require("./helpers/database.js");  
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const routes = require('./routes');
require('dotenv').config();
const requestLogger = require("./middlewares/requestLogger.js")
const errorHandler = require('./middlewares/errorHandler.js');
const logger = require('./logger/log'); 

const cors = require('cors');

const app = express();

// Middleware para registrar las solicitudes
app.use((req, res, next) => {
  logger.info(`Request: ${req.method} ${req.url}`);
  next();
});

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fusion Hub',
      version: '0.0',
      description: 'Nexus Store es un espacio innovador que conecta estilo y creatividad. Con varias sucursales en la ciudad, cada tienda ofrece un ambiente único donde explorar tendencias, descubrir productos originales y disfrutar de una experiencia de compra inspiradora.',
    },
  },
  apis: ['./routes/*.js', './models/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware para manejar JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de CORS
const allowedOrigins = ['http://localhost:3000', 'https://viewrt.onrender.com']; // Agrega tus orígenes permitidos aquí

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    credentials: true, // Permitir el envío de cookies
  })
);

// Usa las rutas de index
app.use('/api', routes); // Prefijo para todas las rutas


// Sincronización de modelos
sequelize.sync({ alter: true })
  .then(() => {
    console.info("Todos los modelos se sincronizaron correctamente."); // Usa logger aquí
  })
  .catch((err) => { 
    console.error("Ha ocurrido un error al sincronizar los modelos: ", err); // Usa logger aquí
  });
  
  
  
  app.use(errorHandler);
  app.use(requestLogger);
// Iniciar el servidor
app.listen(3001, () => {
  logger.info('Servidor iniciado en http://localhost:3001/'); // Usa logger aquí
});