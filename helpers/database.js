const Sequelize = require("sequelize");
const dotenv = require("dotenv").config();
const pg = require("pg"); 

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DIALECT = process.env.DB_DIALECT;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;


// Conexión a la base de datos
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: DB_DIALECT,
    port: DB_PORT,
    logging: console.log, // Solo esta línea para logging
    dialectModule: pg,
    
    // Elimina dialectOptions si no es necesario
});

module.exports = sequelize;