const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/database");
const Product = require('./product')

const Request = sequelize.define("request", {
    request_date: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, 
{
    timestamps: true,
    paranoid: true,
});

Unity.hasMany(Request, {
    foreignKey: 'unity_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Request.belongsTo(Unity, {
    foreignKey: 'unity_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Request.belongsToMany(Product, {
    through: "RequestProduct",
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});


module.exports = Request;
