const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Evento = sequelize.define('Evento', {
  oficina: { 
    type: DataTypes.STRING, 
    allowNull: false,
    defaultValue: 'fce',
    validate: {
      isIn: [['fce', 'cesepi', 'ocaa', 'cerseu', 'posgrado']]
    }
  },
  titulo:      { type: DataTypes.STRING, allowNull: false },
  fecha:       { type: DataTypes.DATEONLY },
  fecha_vencimiento: { type: DataTypes.DATEONLY },
  imagen:      { type: DataTypes.STRING },
  descripcion: { type: DataTypes.TEXT },
  url:         { type: DataTypes.STRING }
}, { tableName: 'eventos', timestamps: false });

module.exports = Evento;