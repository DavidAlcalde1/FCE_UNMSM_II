const { sequelize } = require('../config/db');
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function crearAdministradores() {
    try {
        console.log('🔄 Sincronizando modelo Admin...');
        await Admin.sync({ alter: true });

        // 1. Super Admin (usando variables de entorno existentes)
        const [superAdmin, created] = await Admin.findOrCreate({
            where: { username: process.env.ADMIN_USER || 'admin' },
            defaults: {
                password_hash: process.env.ADMIN_PASS || 'admin123',
                role: 'super_admin',
                nombre_completo: 'Administrador General FCE',
                email: 'admin@fce.unmsm.edu.pe',
                activo: true
            }
        });

        console.log(`✅ Super Admin: ${created ? 'creado' : 'ya existe'}`);
        if (created) {
            console.log(`   - Usuario: ${process.env.ADMIN_USER || 'admin'}`);
            console.log(`   - Contraseña: (la definida en .env)`);
        }

        // 2. Admin CERSEU
        const [cerseuAdmin, createdCerseu] = await Admin.findOrCreate({
            where: { username: 'cerseu_admin' },
            defaults: {
                password_hash: await bcrypt.hash('Cerseu2025*', 10),
                role: 'oficina_admin',
                oficina: 'cerseu',
                nombre_completo: 'Administrador CERSEU',
                email: 'cerseu@fce.unmsm.edu.pe',
                activo: true
            }
        });
        console.log(`✅ Admin CERSEU: ${createdCerseu ? 'creado' : 'ya existe'}`);

        // 3. Admin CESEPI
        const [cesepiAdmin, createdCesepi] = await Admin.findOrCreate({
            where: { username: 'cesepi_admin' },
            defaults: {
                password_hash: await bcrypt.hash('Cesepi2025*', 10),
                role: 'oficina_admin',
                oficina: 'cesepi',
                nombre_completo: 'Administrador CESEPI',
                email: 'cesepi@fce.unmsm.edu.pe',
                activo: true
            }
        });
        console.log(`✅ Admin CESEPI: ${createdCesepi ? 'creado' : 'ya existe'}`);

        // 4. Admin OCAA
        const [ocaaAdmin, createdOcaa] = await Admin.findOrCreate({
            where: { username: 'ocaa_admin' },
            defaults: {
                password_hash: await bcrypt.hash('Ocaa2025*', 10),
                role: 'oficina_admin',
                oficina: 'ocaa',
                nombre_completo: 'Administrador OCAA',
                email: 'ocaa@fce.unmsm.edu.pe',
                activo: true
            }
        });
        console.log(`✅ Admin OCAA: ${createdOcaa ? 'creado' : 'ya existe'}`);

        // 5. Admin POSGRADO
        const [posgradoAdmin, createdPosgrado] = await Admin.findOrCreate({
            where: { username: 'posgrado_admin' },
            defaults: {
                password_hash: await bcrypt.hash('Posgrado2025*', 10),
                role: 'oficina_admin',
                oficina: 'posgrado',
                nombre_completo: 'Administrador POSGRADO',
                email: 'posgrado@fce.unmsm.edu.pe',
                activo: true
            }
        });
        console.log(`✅ Admin POSGRADO: ${createdPosgrado ? 'creado' : 'ya existe'}`);

        console.log('\n🎉 TODOS LOS ADMINISTRADORES CREADOS EXITOSAMENTE');
        console.log('\n📋 CREDENCIALES:');
        console.log('==========================================');
        console.log('SUPER ADMIN:');
        console.log(`   Usuario: ${process.env.ADMIN_USER || 'admin'}`);
        console.log(`   Contraseña: (la definida en .env)`);
        console.log('==========================================');
        console.log('ADMINISTRADORES DE OFICINA:');
        console.log('   CERSEU   - usuario: cerseu_admin   / contraseña: Cerseu2025*');
        console.log('   CESEPI   - usuario: cesepi_admin   / contraseña: Cesepi2025*');
        console.log('   OCAA     - usuario: ocaa_admin     / contraseña: Ocaa2025*');
        console.log('   POSGRADO - usuario: posgrado_admin / contraseña: Posgrado2025*');
        console.log('==========================================');

    } catch (error) {
        console.error('❌ Error creando administradores:', error);
    } finally {
        await sequelize.close();
    }
}

// Ejecutar
crearAdministradores();