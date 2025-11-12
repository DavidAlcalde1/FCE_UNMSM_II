const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Maestria = sequelize.define('Maestria', {
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
}, { tableName: 'maestrias', timestamps: false });

module.exports = Maestria;