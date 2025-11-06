const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Noticia = sequelize.define('Noticia', {
  titulo:     { type: DataTypes.STRING, allowNull: false },
  resumen:    { type: DataTypes.TEXT },
  contenido:  { type: DataTypes.TEXT },
  fecha:      { type: DataTypes.DATEONLY },
  fecha_vencimiento: { type: DataTypes.DATEONLY },
  imagen:     { type: DataTypes.STRING }
}, { tableName: 'noticias', timestamps: false });

module.exports = Noticia;