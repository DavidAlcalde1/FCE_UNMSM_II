const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Comunicado = sequelize.define('Comunicado', {
  titulo:   { type: DataTypes.STRING, allowNull: false },
  contenido:  { type: DataTypes.TEXT },
  fecha:    { type: DataTypes.DATEONLY },
  archivo: { type: DataTypes.STRING }
}, { tableName: 'comunicados', timestamps: false });

module.exports = Comunicado;