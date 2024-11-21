const { DataTypes } = require('sequelize')
const sequelize = require('../helpers/database')
const Product = require('./product')

const Unity = sequelize.define("unity", {
    unity_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    complex: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cost_center: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},
{
    timestamps: true,
    paranoid: true,
});

Unity.belongsToMany(Product, {
    through: "UnityProduct",
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});


module.exports = Unity;
