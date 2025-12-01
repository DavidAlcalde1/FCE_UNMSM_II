const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Reclamo = sequelize.define('Reclamo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 255]
        }
    },
    dni: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [8, 8],
            is: /^\d{8}$/i
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: true
    },
    tipo: {
        type: DataTypes.ENUM,
        values: ['Queja', 'Reclamo', 'Sugerencia', 'Felicitación'],
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [10, 2000]
        }
    },
    estado: {
        type: DataTypes.ENUM,
        values: ['Pendiente', 'En Proceso', 'Resuelto', 'Cerrado'],
        allowNull: false,
        defaultValue: 'Pendiente'
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    fecha_actualizacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    admin_respuesta: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    fecha_respuesta: {
        type: DataTypes.DATE,
        allowNull: true
    },
    ip_address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    user_agent: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'reclamos',
    timestamps: false, // Usamos timestamps personalizados
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion',
    
    hooks: {
        beforeUpdate: (reclamo) => {
            reclamo.fecha_actualizacion = new Date();
        }
    }
});

// Método estático para obtener estadísticas
Reclamo.obtenerEstadisticas = async function() {
    const [total, pendientes, enProceso, resueltos, cerrados] = await Promise.all([
        this.count(),
        this.count({ where: { estado: 'Pendiente' } }),
        this.count({ where: { estado: 'En Proceso' } }),
        this.count({ where: { estado: 'Resuelto' } }),
        this.count({ where: { estado: 'Cerrado' } })
    ]);
    
    return { total, pendientes, enProceso, resueltos, cerrados };
};

// Método para verificar si es válido
Reclamo.prototype.esValido = function() {
    return this.nombre && 
           this.dni && 
           this.email && 
           this.tipo && 
           this.descripcion &&
           this.dni.length === 8;
};

// Método para verificar si puede ser respondido
Reclamo.prototype.puedeSerRespondido = function() {
    return this.estado === 'Pendiente' || this.estado === 'En Proceso';
};

module.exports = Reclamo;