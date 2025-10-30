require('dotenv').config();
const fs = require('fs');
const path = require('path');
const sequelize = require('./src/config/db');
const Noticia   = require('./src/models/Noticia');
const Comunicado = require('./src/models/Comunicado');
const Evento    = require('./src/models/Evento');
const Egresado  = require('./src/models/Egresado');

// Ruta dentro del contenedor (copiaremos ahí los JSON)
const BASE_PATH = '/tmp/json-data';

// Convierte cualquier fecha a ISO (YYYY-MM-DD) o null si no es válida
function toISODate(str) {
  if (!str || str === 'Invalid date') return null;
  const d = new Date(str);
  return isNaN(d) ? null : d.toISOString().split('T')[0];
}

async function run() {
  try {
    await sequelize.authenticate();
    console.log('DB conectada');

    await sequelize.sync({ force: false }); // no borrar datos previos

    // ---- NOTICIAS ----
    const notPath = path.join(BASE_PATH, 'noticias.json');
    if (fs.existsSync(notPath)) {
      const dataN = JSON.parse(fs.readFileSync(notPath, 'utf-8'));
      await Noticia.bulkCreate(
        dataN.map(n => ({ ...n, id: undefined })), // quita id para evitar duplicados
        { ignoreDuplicates: true }
      );
      console.log(`✅ ${dataN.length} noticias insertadas`);
    } else {
      console.log('⚠️  noticias.json no encontrado, se usa array dummy');
      await Noticia.bulkCreate([
        { titulo: 'Conferencia Magistral', resumen: 'La economía en 2025', fecha: '2025-12-13', imagen: '/img/noticia1.jpg' },
        { titulo: 'Apertura de posgrado',  resumen: 'Nuevos cursos',      fecha: '2025-12-01', imagen: '/img/noticia2.jpg' }
      ]);
    }

    // ---- COMUNICADOS ----
    const comPath = path.join(BASE_PATH, 'comunicados.json');
    if (fs.existsSync(comPath)) {
      const dataC = JSON.parse(fs.readFileSync(comPath, 'utf-8'));
      await Comunicado.bulkCreate(
        dataC.map(c => ({ ...c, id: undefined, fecha: toISODate(c.fecha) })),
        { ignoreDuplicates: true }
      );
      console.log(`✅ ${dataC.length} comunicados insertados`);
    } else {
      console.log('⚠️  comunicados.json no encontrado, se usa array dummy');
      await Comunicado.bulkCreate([
        { titulo: 'Matrícula extemporánea', pdf_url: '/docs/com1.pdf', fecha: '2025-12-15' },
        { titulo: 'Cronograma de clases',   pdf_url: '/docs/com2.pdf', fecha: '2025-12-10' }
      ]);
    }

    // ---- EVENTOS ----
    const evPath = path.join(BASE_PATH, 'eventos.json');
    if (fs.existsSync(evPath)) {
      const dataE = JSON.parse(fs.readFileSync(evPath, 'utf-8'));
      await Evento.bulkCreate(
        dataE.map(e => ({ ...e, id: undefined, fecha: toISODate(e.fecha) })),
        { ignoreDuplicates: true }
      );
      console.log(`✅ ${dataE.length} eventos insertados`);
    } else {
      console.log('⚠️  eventos.json no encontrado, se usa array dummy');
      await Evento.bulkCreate([
        { titulo: 'Conferencia Magistral', fecha: '2025-12-20', imagen: '/img/evento1.jpg', descripcion: 'Economía 2025', url: '/eventos/1' },
        { titulo: 'Apertura de Posgrado',  fecha: '2025-12-25', imagen: '/img/evento2.jpg', descripcion: 'Nuevos cursos', url: '/eventos/2' }
      ]);
    }

    // ---- EGRESADOS ----
    const egPath = path.join(BASE_PATH, 'egresados.json');
    if (fs.existsSync(egPath)) {
      const dataG = JSON.parse(fs.readFileSync(egPath, 'utf-8'));
      await Egresado.bulkCreate(
        dataG.map(g => ({ ...g, id: undefined })),
        { ignoreDuplicates: true }
      );
      console.log(`✅ ${dataG.length} egresados insertados`);
    } else {
      console.log('⚠️  egresados.json no encontrado, se usa array dummy');
      await Egresado.bulkCreate([
        { nombre: 'Juan Pérez', titulo: 'Economista', empresa: 'BCRP', testimonio: 'Excelente formación', imagen: '/img/egresado1.jpg' },
        { nombre: 'María López', titulo: 'Magister en Finanzas', empresa: 'Ministerio de Economía', testimonio: 'Gracias FCE', imagen: '/img/egresado2.jpg' }
      ]);
    }

    console.log('✅ Seed INDEX finalizado');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en seedIndex:', err);
    process.exit(1);
  }
}

run();