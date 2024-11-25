    const { DataTypes } = require('sequelize')
    const sequelize = require('../helpers/database')
    const Unity = require('./unidad')

    const Storage = sequelize.define('storage', {
        last_review :{
            type: DataTypes.DATE, 
            allowNull: false,
        },
    },
    {
        timestamps: true,
        paranoid: true,
    }) 

    Unity.hasMany(Storage, {
        foreignKey: 'unity_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    Storage.belongsTo(Unity, {
        foreignKey: 'unity_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });


    module.exports = Storage;







