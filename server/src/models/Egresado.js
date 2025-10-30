const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Egresado = sequelize.define('Egresado', {
  nombre:     { type: DataTypes.STRING, allowNull: false },
  titulo:     { type: DataTypes.STRING },
  empresa:    { type: DataTypes.STRING },
  testimonio: { type: DataTypes.TEXT },
  imagen:     { type: DataTypes.STRING }
}, { tableName: 'egresados', timestamps: false });

module.exports = Egresado;