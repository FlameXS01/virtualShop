const express = require('express');
const sequelize = require("./helpers/database.js");  
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const routes = require('./routes');
require ('dotenv').config()

const cors = require('cors');
const morgan = require('morgan');



const app = express();
app.use(cors(corsOptions));
app.use(morgan('dev'));



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

// Usa las rutas de index
app.use('/api', routes); // Prefijo para todas las rutas


// config del cors
const allowedOrigins = ['http://localhost:3000'];
app.use(
  cors({
    origin : allowedOrigins,
    metods : ['GET', 'POST', 'PUT', 'DELETE'],
    credentials : true,
  })
);

// Sincronización de modelos
sequelize.sync({ alter: true })
  .then(() => {
    console.log("Todos los modelos se sincronizaron correctamente.");
  })
  .catch((err) => {
    console.log("Ha ocurrido un error al sincronizar los modelos: ", err);
  });

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor iniciado en http://localhost:3000/');
});

