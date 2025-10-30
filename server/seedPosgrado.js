require('dotenv').config();
const fs = require('fs');
const path = require('path');
const sequelize = require('./src/config/db');
const Maestria = require('./src/models/Maestria');
const Doctorado = require('./src/models/Doctorado');

const BASE_PATH = '/tmp'; 

async function run() {
  try {
    await sequelize.authenticate();
    console.log('DB conectada');

    // Sincroniza tablas (crea si no existen)
    await sequelize.sync({ force: true }); // force = borra y crea

    // ---- MAESTRÍAS ----
    const maestriasPath = path.join(BASE_PATH, 'maestrias.json');
    if (fs.existsSync(maestriasPath)) {
      const dataM = JSON.parse(fs.readFileSync(maestriasPath, 'utf-8'));
      await Maestria.bulkCreate(dataM);
      console.log(`✅ ${dataM.length} maestrías insertadas`);
    } else {
      console.log('⚠️  maestrias.json no encontrado, se usa array dummy');
      await Maestria.bulkCreate([
        { nombre: 'Maestría en Economía', imagen: '/img/maestria.jpg', enlace: '/maestria/economia' },
        { nombre: 'Maestría en Finanzas',  imagen: '/img/maestria.jpg', enlace: '/maestria/finanzas' }
      ]);
    }

    // ---- DOCTORADOS ----
    const doctoradosPath = path.join(BASE_PATH, 'doctorados.json');
    if (fs.existsSync(doctoradosPath)) {
      const dataD = JSON.parse(fs.readFileSync(doctoradosPath, 'utf-8'));
      await Doctorado.bulkCreate(dataD);
      console.log(`✅ ${dataD.length} doctorados insertados`);
    } else {
      console.log('⚠️  doctorados.json no encontrado, se usa array dummy');
      await Doctorado.bulkCreate([
        { nombre: 'Doctorado en Economía', imagen: '/img/doctorado.jpg', enlace: '/doctorado/economia' }
      ]);
    }

    console.log('✅ Seed finalizado');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en seed:', err);
    process.exit(1);
  }
}

run();