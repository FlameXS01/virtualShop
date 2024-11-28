const express = require('express');
const sequelize = require("./helpers/database.js");  
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const routes = require('./routes');

const app = express();


// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Título del Swagger',
      version: '1.0',
      description: 'Descripción',
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

