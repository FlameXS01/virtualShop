const { DataTypes } = require('sequelize');
const sequelize = require('../helpers/database');
const bcrypt = require('bcryptjs'); // Asegúrate de instalar bcryptjs
const { toDefaultValue } = require('sequelize/lib/utils');

const User = sequelize.define('user', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    
    phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rol: {
        type: DataTypes.ENUM("usuario", "administrador"),
        allowNull: false,
        defaultValue: "usuario",
    },
    url_imagen: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    twoFactorSecret: {
        type: DataTypes.STRING,
        allowNull: true
    },
    twoFactorEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
}, {
    timestamps: true,
    paranoid: true,
});


User .beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10); 
    user.password = await bcrypt.hash(user.password, salt); 
});

module.exports = User;  