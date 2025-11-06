// ✅ server/src/models/Contacto.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // ← Importa la instancia de Sequelize

const Contacto = sequelize.define('Contacto', {
  oficina: { type: DataTypes.STRING, allowNull: false },
  nombre: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  telefono: { type: DataTypes.STRING },
  mensaje: { type: DataTypes.TEXT, allowNull: false },
  leido: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { tableName: 'contactos', timestamps: true });

module.exports = Contacto;