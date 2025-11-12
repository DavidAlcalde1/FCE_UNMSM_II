const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Doctorado = sequelize.define('Doctorado', {
  oficina: { 
    type: DataTypes.STRING, 
    allowNull: false,
    defaultValue: 'fce',
    validate: {
      isIn: [['fce', 'cesepi', 'ocaa', 'cerseu', 'posgrado']]
    }
  },
  nombre:  { type: DataTypes.STRING, allowNull: false },
  imagen:  { type: DataTypes.STRING },
  enlace:  { type: DataTypes.STRING }
}, { tableName: 'doctorados', timestamps: false });

module.exports = Doctorado;