const Sequelize = require("sequelize");
const dotenv = require("dotenv").config();

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DIALECT = process.env.DB_DIALECT;
const DB_HOST = process.env.DB_HOST;

// Conexión a la base de datos
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: DB_DIALECT,
    logging: false,
});

// Función para comprobar que salió bien la conexión con la base de datos
sequelize
  .authenticate()
  .then(() => {
    console.log("Conexión establecida correctamente.");
  })
  .catch((err) => {
    console.error("Error al conectarse a la base de datos:", err);
  });

module.exports = sequelize;