const express = require('express');
const sequelize = require("./helpers/database.js");  
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

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
  console.log('Servidor iniciado en el puerto 3000');
});

