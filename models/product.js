const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/database");

const Product = sequelize.define("product", {
    cod_ub: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cod_prod: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    desc_prod: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    h_much: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    unit: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

}, 
{
    timestamps: true,
    paranoid: true,
});

module.exports = Product;
