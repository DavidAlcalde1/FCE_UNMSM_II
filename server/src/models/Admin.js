const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcrypt');

const Admin = sequelize.define('Admin', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: { msg: 'El nombre de usuario es obligatorio' }
        }
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('super_admin', 'oficina_admin'),
        defaultValue: 'oficina_admin'
    },
    oficina: {
        type: DataTypes.ENUM('fce', 'cesepi', 'ocaa', 'cerseu', 'posgrado'),
        allowNull: true,
        validate: {
            isRequiredForOficina(value) {
                if (this.role === 'oficina_admin' && !value) {
                    throw new Error('El campo oficina es obligatorio para administradores de oficina');
                }
            }
        }
    },
    nombre_completo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: { msg: 'Debe ser un email válido' }
        }
    },
    ultimo_acceso: {
        type: DataTypes.DATE,
        allowNull: true
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true,
    tableName: 'admins',
    hooks: {
        beforeCreate: async (admin) => {
            if (admin.password_hash && !admin.password_hash.startsWith('$2b$')) {
                const salt = await bcrypt.genSalt(10);
                admin.password_hash = await bcrypt.hash(admin.password_hash, salt);
            }
        },
        beforeUpdate: async (admin) => {
            if (admin.changed('password_hash') && !admin.password_hash.startsWith('$2b$')) {
                const salt = await bcrypt.genSalt(10);
                admin.password_hash = await bcrypt.hash(admin.password_hash, salt);
            }
        }
    }
});

// Método para validar contraseña
Admin.prototype.validarPassword = async function (password) {
    return await bcrypt.compare(password, this.password_hash);
};




// Método para obtener datos públicos (sin password_hash)
Admin.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.password_hash;
    return values;
};

module.exports = Admin;