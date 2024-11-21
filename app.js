const express = require('express');
const sequelize = require("./helpers/database.js");  



const Storage = require("./models/inventario"); 
const Locality = require("./models/localidad"); 
const Product = require("./models/product");
const Request = require("./models/request");
const Unity = require("./models/unidad");


const app = express();

sequelize
.sync({ alter: true })
.then(() => {
console.log("Todos los modelos se sincronizaron correctamente.");
}) .catch((err) => {
console.log("Ha ocurrido un error al sincronizar los modelos: ", err); 
});



app.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000');
});

