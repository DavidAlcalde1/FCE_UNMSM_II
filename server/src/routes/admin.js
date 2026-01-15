const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Noticia = require('../models/Noticia');
const Evento = require('../models/Evento');
const Comunicado = require('../models/Comunicado');
const Egresado = require('../models/Egresado');
const Maestria = require('../models/Maestria');
const Doctorado = require('../models/Doctorado');
const Contacto = require('../models/Contacto');
const upload = require('../middleware/upload');
const PDFDocument = require('pdfkit');
const { Op } = require('sequelize');
const Reclamo = require('../models/Reclamo');

// ✅ Importación faltante para sequelize.query
const { sequelize } = require('../config/db');

// Middleware: verifica si el admin YA inició sesión
function requireAuth(req, res, next) {
  if (req.session?.adminAuthenticated) {
    return next();
  }
  res.redirect('/admin/login');
}

// Middleware: procesa el LOGIN (solo POST)
function handleLogin(req, res, next) {
  const { user, pass } = req.body;
  if (user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS) {
    req.session.adminAuthenticated = true;
    return next();
  }
  res.status(401).send('Acceso no autorizado');
}

// Login: muestra formulario (GET)
router.get('/login', (req, res) => {
  if (req.session?.adminAuthenticated) return res.redirect('/admin');
  res.render('admin/login');
});

// Procesa login (POST)
router.post('/login', handleLogin, (req, res) => {
  res.redirect('/admin');
});

// Panel principal (protegido) - Dashboard con estadísticas
router.get('/', requireAuth, async (_req, res) => {
  const stats = {
    noticias: await Noticia.count(),
    eventos: await Evento.count(),
    comunicados: await Comunicado.count(),
    egresados: await Egresado.count(),
    maestrias: await Maestria.count(),
    doctorados: await Doctorado.count(),
    contactos: await Contacto.count({
      where: {
        oficina: {
          [Op.not]: 'posgrado'  // Excluir posgrado
        }
      }
    }),
    reclamos: await Reclamo.count(),
    contactosPosgrado: await Contacto.count({ where: { oficina: 'posgrado' } }), 
    contactosCerseu: await Contacto.count({ where: { oficina: 'cerseu' } }),
  };
  res.render('admin/dashboard', { stats });
});

// === NOTICIAS ===
router.get('/noticias', requireAuth, async (_req, res) => {
  const noticias = await Noticia.findAll({ order: [['fecha', 'DESC']] });
  res.render('admin/noticias', { noticias });
});

router.get('/noticias/nueva', requireAuth, (_req, res) => {
  res.render('admin/noticia-form', { noticia: null });
});

router.post('/noticias', requireAuth, upload.single('imagen'), async (req, res) => {
  try {
    const { titulo, resumen, contenido, fecha, fecha_vencimiento} = req.body;
    const data = {
      titulo: (titulo || '').trim(),
      resumen: (resumen || '').trim(),
      contenido: (contenido || '').trim(),
      fecha: fecha || null,
      fecha_vencimiento: fecha_vencimiento || null, 
      imagen: req.file 
        ? `img/index/noticias/${req.file.filename}` 
        : (req.body.imagen || null)
    };

    const errores = [];
    if (!data.titulo) errores.push('El título es obligatorio.');
    if (!data.resumen) errores.push('El resumen es obligatorio.');
    if (!data.contenido) errores.push('El contenido es obligatorio.');
    if (!data.fecha) errores.push('La fecha es obligatoria.');

    if (errores.length > 0) {
      return res.render('admin/noticia-form', { noticia: data, errores });
    }

    await Noticia.create(data);
    res.redirect('/admin/noticias');

  } catch (error) {
    console.error('Error al crear noticia:', error);
    res.render('admin/noticia-form', { 
      noticia: { ...req.body, imagen: req.body.imagen }, 
      errores: ['No se pudo guardar la noticia. Verifica los datos.'] 
    });
  }
});

router.post('/noticias/:id', requireAuth, upload.single('imagen'), async (req, res) => {
  try {
    const { titulo, resumen, contenido, fecha, fecha_vencimiento } = req.body;
    const id = req.params.id;
    const data = {
      titulo: (titulo || '').trim(),
      resumen: (resumen || '').trim(),
      contenido: (contenido || '').trim(),
      fecha: fecha || null,
      fecha_vencimiento: fecha_vencimiento || null, 
      imagen: req.file 
        ? `img/index/noticias/${req.file.filename}` 
        : (req.body.imagen || null)
    };

    const errores = [];
    if (!data.titulo) errores.push('El título es obligatorio.');
    if (!data.resumen) errores.push('El resumen es obligatorio.');
    if (!data.contenido) errores.push('El contenido es obligatorio.');
    if (!data.fecha) errores.push('La fecha es obligatoria.');

    if (errores.length > 0) {
      return res.render('admin/noticia-form', { noticia: { id, ...data }, errores });
    }

    await Noticia.update(data, { where: { id } });
    res.redirect('/admin/noticias');

  } catch (error) {
    console.error('Error al actualizar noticia:', error);
    res.render('admin/noticia-form', { 
      noticia: { id, ...req.body, imagen: req.body.imagen }, 
      errores: ['No se pudo actualizar la noticia. Intenta nuevamente.'] 
    });
  }
});

// === NOTICIAS - ELIMINAR ===
router.post('/noticias/:id/eliminar', requireAuth, async (req, res) => {
  await Noticia.destroy({ where: { id: req.params.id } });
  res.redirect('/admin/noticias');
});

// === NOTICIAS - EDITAR ===
router.get('/noticias/:id/editar', requireAuth, async (req, res) => {
  try {
    const noticia = await Noticia.findByPk(req.params.id);
    if (!noticia) {
      return res.status(404).send('Noticia no encontrada');
    }
    res.render('admin/noticia-form', { noticia });
  } catch (error) {
    console.error('Error al cargar noticia para edición:', error);
    res.status(500).send('Error al cargar el formulario');
  }
});

// === EVENTOS ===
router.get('/eventos', requireAuth, async (_req, res) => {
  const eventos = await Evento.findAll({ order: [['fecha', 'DESC']] });
  res.render('admin/eventos', { eventos });
});

router.get('/eventos/nuevo', requireAuth, (_req, res) => {
  res.render('admin/evento-form', { evento: null });
});

router.post('/eventos', requireAuth, upload.single('imagen'), async (req, res) => {
  try {
    const data = {
      titulo: req.body.titulo?.trim(),
      descripcion: req.body.descripcion?.trim() || undefined,
      fecha: req.body.fecha || undefined,
      url: req.body.url?.trim() || undefined,
      fecha_vencimiento: req.body.fecha_vencimiento ? req.body.fecha_vencimiento : undefined,
      imagen: req.file ? `img/index/eventos/${req.file.filename}` : (req.body.imagen || undefined)
    };

    const errores = [];
    if (!data.titulo) errores.push('El título es obligatorio.');
    if (!data.fecha) errores.push('La fecha es obligatoria.');

    if (errores.length > 0) {
      return res.render('admin/evento-form', { evento: req.body, errores });
    }

    Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);
    await Evento.create(data);
    res.redirect('/admin/eventos');

  } catch (error) {
    console.error('Error al crear evento:', error);
    res.render('admin/evento-form', { 
      evento: req.body,
      errores: ['No se pudo guardar el evento. Verifica los datos.'] 
    });
  }
});

// === EVENTOS - ELIMINAR ===
router.post('/eventos/:id/eliminar', requireAuth, async (req, res) => {
  await Evento.destroy({ where: { id: req.params.id } });
  res.redirect('/admin/eventos');
});

// === EVENTOS - ACTUALIZAR ===
router.post('/eventos/:id', requireAuth, upload.single('imagen'), async (req, res) => {
  try {
    const { id } = req.params;
    const data = {
      titulo: req.body.titulo?.trim(),
      descripcion: req.body.descripcion?.trim() || undefined,
      fecha: req.body.fecha || undefined,
      url: req.body.url?.trim() || undefined,
      fecha_vencimiento: req.body.fecha_vencimiento ? req.body.fecha_vencimiento : undefined,
      imagen: req.file ? `img/index/eventos/${req.file.filename}` : (req.body.imagen || undefined)
    };

    const errores = [];
    if (!data.titulo) errores.push('El título es obligatorio.');
    if (!data.fecha) errores.push('La fecha es obligatoria.');

    if (errores.length > 0) {
      return res.render('admin/evento-form', { evento: { id, ...req.body }, errores });
    }

    Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);
    await Evento.update(data, { where: { id } });
    res.redirect('/admin/eventos');

  } catch (error) {
    console.error('Error al actualizar evento:', error);
    res.render('admin/evento-form', { 
      evento: { id: req.params.id, ...req.body },
      errores: ['No se pudo actualizar el evento. Verifica los datos.'] 
    });
  }
});

// === EVENTOS - FORMULARIO DE EDICIÓN ===
router.get('/eventos/:id/editar', requireAuth, async (req, res) => {
  const evento = await Evento.findByPk(req.params.id);
  if (!evento) return res.status(404).send('Evento no encontrado');
  res.render('admin/evento-form', { evento });
});

// === COMUNICADOS ===
router.get('/comunicados', requireAuth, async (_req, res) => {
  const comunicados = await Comunicado.findAll({ order: [['fecha', 'DESC']] });
  res.render('admin/comunicados', { comunicados });
});

router.get('/comunicados/nuevo', requireAuth, (_req, res) => {
  res.render('admin/comunicado-form', { comunicado: null });
});

router.post('/comunicados', requireAuth, upload.fields([
  { name: 'imagen', maxCount: 1 },
  { name: 'archivo', maxCount: 1 }
]), async (req, res) => {
  let imagenPath = req.body.imagen;
  let archivoPath = req.body.archivo;

  if (req.files?.imagen?.[0]) {
    imagenPath = `img/index/comunicados/${req.files.imagen[0].filename}`;
  }

  if (req.files?.archivo?.[0]) {
    const docDir = path.join(__dirname, '..', '..', 'client', 'docs', 'comunicados');
    fs.mkdirSync(docDir, { recursive: true });
    archivoPath = `docs/comunicados/${req.files.archivo[0].filename}`;
  }

  await Comunicado.create({
    ...req.body,
    imagen: imagenPath,
    archivo: archivoPath
  });
  res.redirect('/admin/comunicados');
});

router.get('/comunicados/:id/editar', requireAuth, async (req, res) => {
  const comunicado = await Comunicado.findByPk(req.params.id);
  res.render('admin/comunicado-form', { comunicado });
});

router.post('/comunicados/:id', requireAuth, upload.fields([
  { name: 'imagen', maxCount: 1 },
  { name: 'archivo', maxCount: 1 }
]), async (req, res) => {
  let imagenPath = req.body.imagen;
  let archivoPath = req.body.archivo;

  if (req.files?.imagen?.[0]) {
    imagenPath = `img/index/comunicados/${req.files.imagen[0].filename}`;
  }

  if (req.files?.archivo?.[0]) {
    const docDir = path.join(__dirname, '..', '..', 'client', 'docs', 'comunicados');
    fs.mkdirSync(docDir, { recursive: true });
    archivoPath = `docs/comunicados/${req.files.archivo[0].filename}`;
  }

  await Comunicado.update({
    ...req.body,
    imagen: imagenPath,
    archivo: archivoPath
  }, { where: { id: req.params.id } });
  res.redirect('/admin/comunicados');
});

router.post('/comunicados/:id/eliminar', requireAuth, async (req, res) => {
  await Comunicado.destroy({ where: { id: req.params.id } });
  res.redirect('/admin/comunicados');
});

// === EGRESADOS ===
router.get('/egresados', requireAuth, async (_req, res) => {
  const egresados = await Egresado.findAll();
  res.render('admin/egresados', { egresados });
});

router.get('/egresados/nuevo', requireAuth, (_req, res) => res.render('admin/egresado-form', { egresado: null }));

router.post('/egresados', requireAuth, upload.single('imagen'), async (req, res) => {
  const imagenPath = req.file ? `img/index/egresados/${req.file.filename}` : req.body.imagen;
  await Egresado.create({
    ...req.body,
    imagen: imagenPath
  });
  res.redirect('/admin/egresados');
});

router.get('/egresados/:id/editar', requireAuth, async (req, res) => {
  const egresado = await Egresado.findByPk(req.params.id);
  res.render('admin/egresado-form', { egresado });
});

router.post('/egresados/:id', requireAuth, upload.single('imagen'), async (req, res) => {
  const imagenPath = req.file ? `img/index/egresados/${req.file.filename}` : req.body.imagen;
  await Egresado.update({
    ...req.body,
    imagen: imagenPath
  }, { where: { id: req.params.id } });
  res.redirect('/admin/egresados');
});

router.post('/egresados/:id/eliminar', requireAuth, async (req, res) => {
  await Egresado.destroy({ where: { id: req.params.id } });
  res.redirect('/admin/egresados');
});

// === MAESTRÍAS ===
router.get('/maestrias', requireAuth, async (_req, res) => {
  const maestrias = await Maestria.findAll();
  res.render('admin/maestrias', { maestrias });
});

router.get('/maestrias/nueva', requireAuth, (_req, res) => res.render('admin/maestria-form', { maestria: null }));

router.post('/maestrias', requireAuth, upload.single('imagen'), async (req, res) => {
  const imagenPath = req.file ? `img/maestrias/${req.file.filename}` : req.body.imagen;
  await Maestria.create({
    ...req.body,
    imagen: imagenPath
  });
  res.redirect('/admin/maestrias');
});

router.get('/maestrias/:id/editar', requireAuth, async (req, res) => {
  const maestria = await Maestria.findByPk(req.params.id);
  res.render('admin/maestria-form', { maestria });
});

router.post('/maestrias/:id', requireAuth, upload.single('imagen'), async (req, res) => {
  const imagenPath = req.file ? `img/maestrias/${req.file.filename}` : req.body.imagen;
  await Maestria.update({
    ...req.body,
    imagen: imagenPath
  }, { where: { id: req.params.id } });
  res.redirect('/admin/maestrias');
});

router.post('/maestrias/:id/eliminar', requireAuth, async (req, res) => {
  await Maestria.destroy({ where: { id: req.params.id } });
  res.redirect('/admin/maestrias');
});

// === DOCTORADOS ===
router.get('/doctorados', requireAuth, async (_req, res) => {
  const doctorados = await Doctorado.findAll();
  res.render('admin/doctorados', { doctorados });
});

router.get('/doctorados/nuevo', requireAuth, (_req, res) => res.render('admin/doctorado-form', { doctorado: null }));

router.post('/doctorados', requireAuth, upload.single('imagen'), async (req, res) => {
  const imagenPath = req.file ? `img/doctorados/${req.file.filename}` : req.body.imagen;
  await Doctorado.create({
    ...req.body,
    imagen: imagenPath
  });
  res.redirect('/admin/doctorados');
});

router.get('/doctorados/:id/editar', requireAuth, async (req, res) => {
  const doctorado = await Doctorado.findByPk(req.params.id);
  res.render('admin/doctorado-form', { doctorado });
});

router.post('/doctorados/:id', requireAuth, upload.single('imagen'), async (req, res) => {
  const imagenPath = req.file ? `img/doctorados/${req.file.filename}` : req.body.imagen;
  await Doctorado.update({
    ...req.body,
    imagen: imagenPath
  }, { where: { id: req.params.id } });
  res.redirect('/admin/doctorados');
});

router.post('/doctorados/:id/eliminar', requireAuth, async (req, res) => {
  await Doctorado.destroy({ where: { id: req.params.id } });
  res.redirect('/admin/doctorados');
});

// === CONTACTOS ===
router.get('/contactos', requireAuth, async (req, res) => {
  const { fechaInicio, fechaFin } = req.query;
  const whereClause = {
    oficina: {
      [Op.not]: 'posgrado'  // Excluir posgrado
    }
  };
  
  // Filtrar por fechas si se proporcionan
  if (fechaInicio || fechaFin) {
    whereClause.createdAt = {};
    if (fechaInicio) {
      whereClause.createdAt[Op.gte] = new Date(fechaInicio);
    }
    if (fechaFin) {
      const fechaFinDate = new Date(fechaFin);
      fechaFinDate.setHours(23, 59, 59, 999);
      whereClause.createdAt[Op.lte] = fechaFinDate;
    }
  }

  const contactos = await Contacto.findAll({
    where: whereClause,
    order: [['createdAt', 'DESC']]
  });

  res.render('admin/contactos', { 
    contactos,
    oficina: null,
    fechaInicio: fechaInicio || '',
    fechaFin: fechaFin || ''
  });
});

// Exportar contactos a PDF
router.get('/contactos/exportar-pdf', requireAuth, async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const whereClause = {
      oficina: {
        [Op.not]: 'posgrado'
      }
    };
    
    if (fechaInicio || fechaFin) {
      whereClause.createdAt = {};
      if (fechaInicio) whereClause.createdAt[Op.gte] = new Date(fechaInicio);
      if (fechaFin) {
        const fechaFinDate = new Date(fechaFin);
        fechaFinDate.setHours(23, 59, 59, 999);
        whereClause.createdAt[Op.lte] = fechaFinDate;
      }
    }

    const contactos = await Contacto.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });

    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 20, left: 45, right: 45 }
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=contactos_fce.pdf');
    doc.pipe(res);

    // === ENCABEZADO INSTITUCIONAL ===
    const logoPath = path.join(__dirname, '..', '..', 'client', 'img', 'index', 'logo_fce.png');
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 45, 40, { width: 120 });
    }
    doc.font('Helvetica-Bold').fontSize(14)
       .text('Facultad de Ciencias Económicas', 180, 50)
       .fontSize(12).text('Universidad Nacional Mayor de San Marcos', 180, 65);
    doc.moveTo(45, 90).lineTo(555, 90).stroke('#1c3d6c').lineWidth(2);
    doc.moveDown(2);

    // Título del reporte
    doc.fontSize(14).fillColor('#1c3d6c')
       .text('Contactos - General', { align: 'center' });
    doc.moveDown(0.5);
    
    if (fechaInicio || fechaFin) {
      doc.fontSize(10).fillColor('#666');
      let rango = '';
      if (fechaInicio) rango += `Desde: ${fechaInicio} `;
      if (fechaFin) rango += `Hasta: ${fechaFin}`;
      doc.text(rango, { align: 'center' });
    }
    doc.moveDown(2);

    // === CONFIGURACIÓN DE TABLA CON NÚMERO ===
    const cols = {
      numero:  { x: 45,   width: 30,  align: 'center' },
      fecha:   { x: 75,   width: 90,  align: 'center' },
      oficina: { x: 165,  width: 55,  align: 'center' },
      nombre:  { x: 220,  width: 95,  align: 'center' },
      email:   { x: 315,  width: 140, align: 'center' },
      telefono:{ x: 455,  width: 60,  align: 'center' }
    };
    const rowHeight = 22;
    let y = 100;

    // === ENCABEZADO DE TABLA ===
    const drawHeader = () => {
      doc.font('Helvetica-Bold').fillColor('#1c3d6c');
      doc.rect(cols.numero.x, y, 510, rowHeight).fill('#1c3d6c');
      doc.fillColor('white').fontSize(9);
      doc.text('N°', cols.numero.x, y + 7, { width: cols.numero.width, align: 'center' });
      doc.text('Fecha/Hora', cols.fecha.x, y + 7, { width: cols.fecha.width, align: 'center' });
      doc.text('Oficina', cols.oficina.x, y + 7, { width: cols.oficina.width, align: 'center' });
      doc.text('Nombre', cols.nombre.x, y + 7, { width: cols.nombre.width, align: 'center' });
      doc.text('Email', cols.email.x, y + 7, { width: cols.email.width, align: 'center' });
      doc.text('Teléfono', cols.telefono.x, y + 7, { width: cols.telefono.width, align: 'center' });
      y += rowHeight;
    };

    // === PIE DE PÁGINA ===
    const drawFooter = () => {
      doc.fontSize(9).font('Helvetica-Oblique').fillColor('#666')
         .moveTo(45, 790).lineTo(555, 790).stroke('#666').lineWidth(2)
         .text('Facultad de Ciencias Económicas - UNMSM © 2025', 45, 795, { width: 510, align: 'center' })
         .text('Developed by Bach. José David Alcalde Cabrera', 45, 805, { width: 510, align: 'center' });
    };

    drawHeader();

    // === FILAS DE DATOS CON NÚMERACIÓN ===
    doc.fillColor('black').font('Helvetica').fontSize(9);
    contactos.forEach((c, i) => {
      if (y + rowHeight > 790) {
        drawFooter();
        doc.addPage();
        y = 100;
        drawHeader();
      }

      // Fondo alternado
      if (i % 2 === 0) {
        doc.fillColor('#f9f9f9').rect(cols.numero.x, y, 510, rowHeight).fill();
        doc.fillColor('black');
      }

      const textOpts = (col) => ({ width: col.width, align: col.align, ellipsis: true });
      
      // Numeración (i + 1)
      doc.text(String(i + 1), cols.numero.x, y + 3, textOpts(cols.numero));
      doc.text(new Date(c.createdAt).toLocaleString('es-PE'), cols.fecha.x, y + 3, textOpts(cols.fecha));
      doc.text(c.oficina, cols.oficina.x, y + 3, textOpts(cols.oficina));
      doc.text(c.nombre, cols.nombre.x, y + 3, textOpts(cols.nombre));
      doc.text(c.email, cols.email.x, y + 3, textOpts(cols.email));
      doc.text(c.telefono || '—', cols.telefono.x, y + 3, textOpts(cols.telefono));

      // Bordes finos
      doc.strokeColor('#ddd').lineWidth(0.5)
         .rect(cols.numero.x, y, 510, rowHeight).stroke();

      y += rowHeight;
    });

    // Total de registros
    doc.moveDown(1);
    doc.font('Helvetica-Bold').fontSize(10)
       .text(`Total de registros: ${contactos.length}`, 45, y + 5);

    drawFooter();
    doc.end();
  } catch (error) {
    console.error('Error al generar PDF:', error);
    res.status(500).send('Error al generar el PDF');
  }
});

// === EXPORTAR EXCEL - CONTACTOS ===
router.get('/contactos/exportar-excel', requireAuth, async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const whereClause = {
      oficina: {
        [Op.not]: 'posgrado'
      }
    };
    
    if (fechaInicio || fechaFin) {
      whereClause.createdAt = {};
      if (fechaInicio) whereClause.createdAt[Op.gte] = new Date(fechaInicio);
      if (fechaFin) {
        const fechaFinDate = new Date(fechaFin);
        fechaFinDate.setHours(23, 59, 59, 999);
        whereClause.createdAt[Op.lte] = fechaFinDate;
      }
    }

    const contactos = await Contacto.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      attributes: ['nombre', 'email', 'telefono', 'mensaje', 'oficina', 'createdAt']
    });

    // Generar CSV
    const csvHeader = 'Nombre,Email,Teléfono,Mensaje,Oficina,Fecha\n';
    const csvData = contactos.map(c => {
      const mensaje = `"${c.mensaje.replace(/"/g, '""')}"`;
      return `"${c.nombre}","${c.email}","${c.telefono || ''}",${mensaje},"${c.oficina}","${c.createdAt.toISOString()}"`;
    }).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="contactos_fce.csv"');
    res.send(csvHeader + csvData);
  } catch (error) {
    console.error('Error al exportar Excel:', error);
    res.status(500).send('Error al exportar');
  }
});







// === CONTACTOS POSGRADO ===
// Ruta específica para ver contactos del formulario de posgrado
router.get('/contactos-posgrado', requireAuth, async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const whereClause = { oficina: 'posgrado' };
    
    // Filtrar por fechas si se proporcionan
    if (fechaInicio || fechaFin) {
      whereClause.createdAt = {};
      if (fechaInicio) {
        whereClause.createdAt[Op.gte] = new Date(fechaInicio);
      }
      if (fechaFin) {
        // Agregar un día a la fecha fin para incluir todo ese día
        const fechaFinDate = new Date(fechaFin);
        fechaFinDate.setHours(23, 59, 59, 999);
        whereClause.createdAt[Op.lte] = fechaFinDate;
      }
    }

    const contactos = await Contacto.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });

    res.render('admin/contactos-posgrado', { 
      title: 'Contactos - Posgrado',
      contactos,
      totalContactos: contactos.length,
      fechaInicio: fechaInicio || '',
      fechaFin: fechaFin || ''
    });
  } catch (error) {
    console.error('Error al obtener contactos de posgrado:', error);
    res.status(500).send('Error interno del servidor');
  }
});


// === EXPORTAR EXCEL - CONTACTOS POSGRADO ===
router.get('/contactos-posgrado/exportar-excel', requireAuth, async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const whereClause = { oficina: 'posgrado' };
    
    if (fechaInicio || fechaFin) {
      whereClause.createdAt = {};
      if (fechaInicio) whereClause.createdAt[Op.gte] = new Date(fechaInicio);
      if (fechaFin) {
        const fechaFinDate = new Date(fechaFin);
        fechaFinDate.setHours(23, 59, 59, 999);
        whereClause.createdAt[Op.lte] = fechaFinDate;
      }
    }

    const contactos = await Contacto.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      attributes: ['nombre', 'email', 'telefono', 'mensaje', 'oficina', 'createdAt']
    });

    // Generar CSV
    const csvHeader = 'Nombre,Email,Teléfono,Mensaje,Oficina,Fecha\n';
    const csvData = contactos.map(c => {
      const mensaje = `"${c.mensaje.replace(/"/g, '""')}"`;
      return `"${c.nombre}","${c.email}","${c.telefono || ''}",${mensaje},"${c.oficina}","${c.createdAt.toISOString()}"`;
    }).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="contactos_posgrado.csv"');
    res.send(csvHeader + csvData);
  } catch (error) {
    console.error('Error al exportar Excel:', error);
    res.status(500).send('Error al exportar');
  }
});


// === EXPORTAR PDF - CONTACTOS POSGRADO ===
router.get('/contactos-posgrado/exportar-pdf', requireAuth, async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const whereClause = { oficina: 'posgrado' };
    
    if (fechaInicio || fechaFin) {
      whereClause.createdAt = {};
      if (fechaInicio) whereClause.createdAt[Op.gte] = new Date(fechaInicio);
      if (fechaFin) {
        const fechaFinDate = new Date(fechaFin);
        fechaFinDate.setHours(23, 59, 59, 999);
        whereClause.createdAt[Op.lte] = fechaFinDate;
      }
    }

    const contactos = await Contacto.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });

    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 20, left: 45, right: 45 }
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=contactos_posgrado.pdf');
    doc.pipe(res);

    // === ENCABEZADO INSTITUCIONAL ===
    const logoPath = path.join(__dirname, '..', '..', 'client', 'img', 'index', 'logo_fce.png');
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 45, 40, { width: 120 });
    }
    doc.font('Helvetica-Bold').fontSize(14)
       .text('Facultad de Ciencias Económicas', 180, 50)
       .fontSize(12).text('Universidad Nacional Mayor de San Marcos', 180, 65);
    doc.moveTo(45, 90).lineTo(555, 90).stroke('#1c3d6c').lineWidth(2);
    doc.moveDown(2);

    // Título del reporte
    doc.fontSize(14).fillColor('#1c3d6c')
       .text('Contactos - Posgrado', { align: 'center' });
    doc.moveDown(0.5);
    
    if (fechaInicio || fechaFin) {
      doc.fontSize(10).fillColor('#666');
      let rango = '';
      if (fechaInicio) rango += `Desde: ${fechaInicio} `;
      if (fechaFin) rango += `Hasta: ${fechaFin}`;
      doc.text(rango, { align: 'center' });
    }
    doc.moveDown(2);

    // === CONFIGURACIÓN DE TABLA CON NÚMERO ===
    const cols = {
      numero:  { x: 45,   width: 30,  align: 'center' },
      fecha:   { x: 75,   width: 90,  align: 'center' },
      oficina: { x: 165,  width: 55,  align: 'center' },
      nombre:  { x: 220,  width: 95,  align: 'center' },
      email:   { x: 315,  width: 140, align: 'center' },
      telefono:{ x: 455,  width: 60,  align: 'center' }
    };
    const rowHeight = 22;
    let y = 100;

    // === ENCABEZADO DE TABLA ===
    const drawHeader = () => {
      doc.font('Helvetica-Bold').fillColor('#1c3d6c');
      doc.rect(cols.numero.x, y, 510, rowHeight).fill('#1c3d6c');
      doc.fillColor('white').fontSize(9);
      doc.text('N°', cols.numero.x, y + 7, { width: cols.numero.width, align: 'center' });
      doc.text('Fecha/Hora', cols.fecha.x, y + 7, { width: cols.fecha.width, align: 'center' });
      doc.text('Oficina', cols.oficina.x, y + 7, { width: cols.oficina.width, align: 'center' });
      doc.text('Nombre', cols.nombre.x, y + 7, { width: cols.nombre.width, align: 'center' });
      doc.text('Email', cols.email.x, y + 7, { width: cols.email.width, align: 'center' });
      doc.text('Teléfono', cols.telefono.x, y + 7, { width: cols.telefono.width, align: 'center' });
      y += rowHeight;
    };

    // === PIE DE PÁGINA ===
    const drawFooter = () => {
      doc.fontSize(9).font('Helvetica-Oblique').fillColor('#666')
         .moveTo(45, 790).lineTo(555, 790).stroke('#666').lineWidth(2)
         .text('Facultad de Ciencias Económicas - UNMSM © 2025', 45, 795, { width: 510, align: 'center' })
         .text('Developed by Bach. José David Alcalde Cabrera', 45, 805, { width: 510, align: 'center' });
    };

    drawHeader();

    // === FILAS DE DATOS CON NÚMERACIÓN ===
    doc.fillColor('black').font('Helvetica').fontSize(9);
    contactos.forEach((c, i) => {
      if (y + rowHeight > 790) {
        drawFooter();
        doc.addPage();
        y = 100;
        drawHeader();
      }

      // Fondo alternado
      if (i % 2 === 0) {
        doc.fillColor('#f9f9f9').rect(cols.numero.x, y, 510, rowHeight).fill();
        doc.fillColor('black');
      }

      const textOpts = (col) => ({ width: col.width, align: col.align, ellipsis: true });
      
      // Numeración (i + 1)
      doc.text(String(i + 1), cols.numero.x, y + 3, textOpts(cols.numero));
      doc.text(new Date(c.createdAt).toLocaleString('es-PE'), cols.fecha.x, y + 3, textOpts(cols.fecha));
      doc.text(c.oficina, cols.oficina.x, y + 3, textOpts(cols.oficina));
      doc.text(c.nombre, cols.nombre.x, y + 3, textOpts(cols.nombre));
      doc.text(c.email, cols.email.x, y + 3, textOpts(cols.email));
      doc.text(c.telefono || '—', cols.telefono.x, y + 3, textOpts(cols.telefono));

      // Bordes finos
      doc.strokeColor('#ddd').lineWidth(0.5)
         .rect(cols.numero.x, y, 510, rowHeight).stroke();

      y += rowHeight;
    });

    // Total de registros
    doc.moveDown(1);
    doc.font('Helvetica-Bold').fontSize(10)
       .text(`Total de registros: ${contactos.length}`, 45, y + 5);

    drawFooter();
    doc.end();
  } catch (error) {
    console.error('Error al generar PDF:', error);
    res.status(500).send('Error al generar el PDF');
  }
});





// === LIBRO DE RECLAMACIONES - RUTAS ADMIN ===

// GET /admin/reclamos - Lista de reclamos con paginación y filtros
router.get('/reclamos', requireAuth, async (req, res) => {
  try {
    const { 
      estado = 'Todos', 
      tipo = 'Todos', 
      busqueda = '', 
      pagina = 1, 
      limite = 20 
    } = req.query;

    const offset = (parseInt(pagina) - 1) * parseInt(limite);

    // Construir filtros
    const whereClause = {};
    
    if (estado !== 'Todos') {
      whereClause.estado = estado;
    }

    if (tipo !== 'Todos') {
      whereClause.tipo = tipo;
    }

    if (busqueda) {
      whereClause[Op.or] = [
        { nombre: { [Op.iLike]: `%${busqueda}%` } },
        { email: { [Op.iLike]: `%${busqueda}%` } },
        { descripcion: { [Op.iLike]: `%${busqueda}%` } }
      ];
    }

    const { count, rows: reclamos } = await Reclamo.findAndCountAll({
      where: whereClause,
      limit: parseInt(limite),
      offset,
      order: [['fecha_creacion', 'DESC']],
      attributes: [
        'id', 'nombre', 'email', 'telefono', 'tipo', 
        'estado', 'fecha_creacion', 'fecha_actualizacion'
      ]
    });

    // Calcular estadísticas
    const estadisticas = await Reclamo.obtenerEstadisticas();

    res.render('admin/reclamos', {
      title: 'Libro de Reclamaciones',
      reclamos,
      estadisticas,
      filtros: { estado, tipo, busqueda },
      pagination: {
        currentPage: parseInt(pagina),
        totalPages: Math.ceil(count / parseInt(limite)),
        totalItems: count,
        limit: parseInt(limite)
      }
    });

  } catch (error) {
    console.error('Error al listar reclamos:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// GET /admin/reclamos/:id - Ver detalle de reclamo
router.get('/reclamos/:id', requireAuth, async (req, res) => {
  try {
    const reclamo = await Reclamo.findByPk(req.params.id);
    
    if (!reclamo) {
      return res.status(404).send('Reclamo no encontrado');
    }

    res.render('admin/reclamo_detalle', {
      title: 'Detalle del Reclamo',
      reclamo
    });

  } catch (error) {
    console.error('Error al obtener reclamo:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// POST /admin/reclamos/:id/responder - Responder a un reclamo
router.post('/reclamos/:id/responder', requireAuth, async (req, res) => {
  try {
    const { estado, respuestaAdmin } = req.body;
    
    const reclamo = await Reclamo.findByPk(req.params.id);
    
    if (!reclamo) {
      return res.status(404).json({
        success: false,
        error: 'Reclamo no encontrado'
      });
    }

    // Validar nuevo estado
    if (estado) {
      const estadosValidos = ['Pendiente', 'En Proceso', 'Resuelto', 'Cerrado'];
      if (!estadosValidos.includes(estado)) {
        return res.status(400).json({
          success: false,
          error: 'Estado no válido'
        });
      }
      reclamo.estado = estado;
    }

    // Actualizar respuesta admin
    if (respuestaAdmin) {
      reclamo.admin_respuesta = respuestaAdmin.trim();
      reclamo.fecha_respuesta = new Date();
      
      // Si se proporciona respuesta, cambiar estado automáticamente a "En Proceso"
      if (reclamo.estado === 'Pendiente') {
        reclamo.estado = 'En Proceso';
      }
    }

    await reclamo.save();

    res.json({
      success: true,
      message: 'Respuesta guardada exitosamente',
      data: {
        id: reclamo.id,
        estado: reclamo.estado,
        fechaActualizacion: reclamo.fecha_actualizacion,
        fechaRespuesta: reclamo.fecha_respuesta
      }
    });

  } catch (error) {
    console.error('Error al responder reclamo:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// GET /admin/logout - Cerrar sesión
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
    }
    res.redirect('/admin/login');
  });
});

// Exportar contactos a CSV
router.get('/reclamos/exportar/csv', requireAuth, async (req, res) => {
  try {
    const reclamos = await Reclamo.findAll({
      order: [['fecha_creacion', 'DESC']],
      attributes: [
        'id', 'nombre', 'dni', 'email', 'telefono', 
        'tipo', 'descripcion', 'estado', 'admin_respuesta',
        'fecha_creacion', 'fecha_respuesta'
      ]
    });

    // Crear CSV
    const csvHeader = 'ID,Nombre,DNI,Email,Teléfono,Tipo,Descripción,Estado,Respuesta,Fecha Creación,Fecha Respuesta\n';
    
    const csvData = reclamos.map(reclamo => {
      return [
        reclamo.id,
        `"${reclamo.nombre.replace(/"/g, '""')}"`,
        reclamo.dni,
        `"${reclamo.email.replace(/"/g, '""')}"`,
        reclamo.telefono || '',
        `"${reclamo.tipo}"`,
        `"${reclamo.descripcion.replace(/"/g, '""')}"`,
        reclamo.estado,
        `"${(reclamo.admin_respuesta || '').replace(/"/g, '""')}"`,
        reclamo.fecha_creacion.toISOString(),
        reclamo.fecha_respuesta ? reclamo.fecha_respuesta.toISOString() : ''
      ].join(',');
    }).join('\n');

    const csvContent = csvHeader + csvData;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="reclamos_${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csvContent);

  } catch (error) {
    console.error('Error al exportar CSV:', error);
    res.status(500).json({
      success: false,
      error: 'Error al exportar los datos'
    });
  }
});






// === RUTAS PARA CERSEU ===
router.get('/contactos-cerseu', requireAuth, async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query;
        
        const whereClause = { oficina: 'cerseu' };
        
        if (fechaInicio && fechaFin) {
            whereClause.createdAt = {
                [Op.gte]: new Date(fechaInicio),
                [Op.lte]: new Date(fechaFin + 'T23:59:59')
            };
        }
        
        const mensajes = await Contacto.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']]
        });
        
        res.render('admin/contactos-cerseu', {
            titulo: 'Mensajes CERSEU',
            mensajes: mensajes,
            currentPage: 'contactos-cerseu',
            fechaInicio: fechaInicio || '',
            fechaFin: fechaFin || ''
        });
    } catch (error) {
        console.error('Error al obtener mensajes de CERSEU:', error);
        res.status(500).send('Error del servidor');
    }
});

// Exportar Excel para CERSEU
router.get('/contactos-cerseu/exportar-excel', requireAuth,  async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query;
        
        const whereClause = { oficina: 'cerseu' };
        
        if (fechaInicio && fechaFin) {
            whereClause.createdAt = {
                [Op.gte]: new Date(fechaInicio),
                [Op.lte]: new Date(fechaFin + 'T23:59:59')
            };
        }
        
        const mensajes = await Contacto.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']]
        });
        
        let csv = 'ID,Nombre,Email,Teléfono,Mensaje,Fecha\n';
        mensajes.forEach(m => {
            const fecha = new Date(m.createdAt).toLocaleDateString('es-PE');
            csv += `${m.id},"${m.nombre}","${m.email}","${m.telefono || ''}","${m.mensaje.replace(/"/g, '""')}","${fecha}"\n`;
        });
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=mensajes-cerseu.csv');
        res.send(csv);
    } catch (error) {
        console.error('Error al exportar Excel CERSEU:', error);
        res.status(500).send('Error del servidor');
    }
});

// Exportar PDF para CERSEU
router.get('/contactos-cerseu/exportar-pdf', requireAuth,  async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query;
        
        const whereClause = { oficina: 'cerseu' };
        
        if (fechaInicio && fechaFin) {
            whereClause.createdAt = {
                [Op.gte]: new Date(fechaInicio),
                [Op.lte]: new Date(fechaFin + 'T23:59:59')
            };
        }
        
        const mensajes = await Contacto.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']]
        });
        
        const PDFDocument = require('pdfkit');
        const doc = new PDFDocument({ margin: 50 });
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=mensajes-cerseu.pdf');
        
        doc.pipe(res);
        
        // Encabezado
        doc.fontSize(20).fillColor('#1a5f2a').text('Reporte de Mensajes - CERSEU', { align: 'center' });
        doc.moveDown();
        
        if (fechaInicio && fechaFin) {
            doc.fontSize(12).fillColor('#666').text(`Período: ${fechaInicio} al ${fechaFin}`, { align: 'center' });
            doc.moveDown();
        }
        
        doc.fontSize(10).fillColor('#000').text(`Fecha de generación: ${new Date().toLocaleDateString('es-PE')}`, { align: 'center' });
        doc.moveDown(2);
        
        // Tabla
        const tableTop = 180;
        const headers = ['Fecha', 'Nombre', 'Email', 'Mensaje'];
        const columnWidths = [70, 100, 150, 200];
        const startX = 50;
        
        // Encabezados de tabla
        doc.font('Helvetica-Bold').fontSize(10);
        let currentX = startX;
        headers.forEach((header, i) => {
            doc.text(header, currentX, tableTop, { width: columnWidths[i] });
            currentX += columnWidths[i];
        });
        
        doc.moveTo(startX, tableTop + 15).lineTo(520, tableTop + 15).stroke('#1a5f2a');
        
        // Filas de datos
        let y = tableTop + 25;
        doc.font('Helvetica').fontSize(9);
        
        mensajes.forEach((m) => {
            if (y > 700) {
                doc.addPage();
                y = 50;
            }
            
            currentX = startX;
            const fecha = new Date(m.createdAt).toLocaleDateString('es-PE');
            const mensajeCorto = m.mensaje.substring(0, 40) + (m.mensaje.length > 40 ? '...' : '');
            
            doc.text(fecha, currentX, y, { width: columnWidths[0] });
            currentX += columnWidths[0];
            doc.text(m.nombre.substring(0, 15), currentX, y, { width: columnWidths[1] });
            currentX += columnWidths[1];
            doc.text(m.email, currentX, y, { width: columnWidths[2] });
            currentX += columnWidths[2];
            doc.text(mensajeCorto, currentX, y, { width: columnWidths[3] });
            
            y += 18;
        });
        
        doc.end();
    } catch (error) {
        console.error('Error al exportar PDF CERSEU:', error);
        res.status(500).send('Error del servidor');
    }
});

// === API PÚBLICA: GUARDAR CONTACTOS ===
router.post('/api/contactos', async (req, res) => {
  try {
    const { nombre, email, telefono, mensaje, oficina } = req.body;

    // Validaciones básicas
    if (!nombre || !email || !mensaje) {
      return res.status(400).json({
        success: false,
        message: 'Los campos nombre, email y mensaje son obligatorios'
      });
    }

    // Crear el contacto
    const contacto = await Contacto.create({
      nombre: nombre.trim(),
      email: email.trim(),
      telefono: telefono ? telefono.trim() : null,
      mensaje: mensaje.trim(),
      oficina: oficina ? oficina.trim() : 'general'
    });

    console.log('Contacto guardado:', contacto.id);

    res.json({
      success: true,
      message: 'Mensaje enviado correctamente'
    });
  } catch (error) {
    console.error('Error al guardar contacto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al guardar el mensaje'
    });
  }
});

// Exportar middleware requireAuth para otros archivos
router.requireAuth = requireAuth;



module.exports = router;