const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/database");
const Unity = require('./unidad')

const Locality = sequelize.define("locality", {
    loc_cod: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    loc_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, 
{
    timestamps: true,
    paranoid: true,
});

Unity.hasMany(Locality, {
    foreignKey: 'unity_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Locality.belongsTo(Unity, {
    foreignKey: 'unity_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

module.exports = Locality;
