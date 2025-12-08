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
    contactos: await Contacto.count(),
    reclamos: await Reclamo.count(),
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
    const { titulo, resumen, contenido, fecha } = req.body;
    const data = {
      titulo: (titulo || '').trim(),
      resumen: (resumen || '').trim(),
      contenido: (contenido || '').trim(),
      fecha: fecha || null,
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
    const { titulo, resumen, contenido, fecha } = req.body;
    const id = req.params.id;
    const data = {
      titulo: (titulo || '').trim(),
      resumen: (resumen || '').trim(),
      contenido: (contenido || '').trim(),
      fecha: fecha || null,
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
  const { oficina } = req.query;
  const oficinasValidas = ['fce', 'ocaa', 'posgrado', 'cerseu', 'cesepi'];
  
  const whereClause = oficina && oficinasValidas.includes(oficina) 
    ? { oficina } 
    : {};

  const contactos = await Contacto.findAll({
    where: whereClause,
    order: [['createdAt', 'DESC']]
  });

  res.render('admin/contactos', { contactos, oficina });
});

// Exportar contactos a PDF
router.get('/contactos/exportar-pdf', requireAuth, async (req, res) => {
  try {
    const contactos = await Contacto.findAll({
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

    // === CONFIGURACIÓN DE TABLA ===
    const cols = {
      fecha:   { x: 45,   width: 120, align: 'center' },
      oficina: { x: 165,  width: 55, align: 'center' },
      nombre:  { x: 220,  width: 100, align: 'center' },
      email:   { x: 320,  width: 150, align: 'center' },
      telefono:{ x: 470,  width: 60, align: 'center' }
    };
    const rowHeight = 22;
    let y = 100;

    // === ENCABEZADO DE TABLA ===
    const drawHeader = () => {
      doc.font('Helvetica-Bold').fillColor('#1c3d6c');
      doc.rect(cols.fecha.x, y, 510, rowHeight).fill('#1c3d6c');
      doc.fillColor('white').fontSize(10);
      doc.text('Fecha/Hora', cols.fecha.x, y + 7, { width: cols.fecha.width, align: 'center' });
      doc.text('Oficina', cols.oficina.x, y + 7, { width: cols.oficina.width, align: 'center' });
      doc.text('Nombre', cols.nombre.x, y + 7, { width: cols.nombre.width, align: 'center' });
      doc.text('Email', cols.email.x, y + 7, { width: cols.email.width, align: 'center' });
      doc.text('Teléfono', cols.telefono.x, y + 7, { width: cols.telefono.width, align: 'center' });
      y += rowHeight;
    };

    // === PIE DE PÁGINA ===
    const drawFooter = () => {
      doc
          .fontSize(9)
          .font('Helvetica-Oblique')
          .fillColor('#666')
          .moveTo(45, 790).lineTo(555, 790).stroke('#666').lineWidth(2)
          .text('Facultad de Ciencias Económicas - UNMSM © 2025', 45, 795, { width: 510, align: 'center' })
          .text('Developed by Bach. José David Alcalde Cabrera', 45, 805, { width: 510, align: 'center' });
    };

    drawHeader();

    // === FILAS DE DATOS ===
    doc.fillColor('black').font('Helvetica').fontSize(9);
    contactos.forEach((c, i) => {
      // Salto de página si no cabe la fila
      if (y + rowHeight > 790) {
        drawFooter();   // ← pie ANTES de saltar
        doc.addPage();
        y = 100;
        drawHeader();
      }

      // Fondo alternado
      if (i % 2 === 0) {
        doc.fillColor('#f9f9f9').rect(cols.fecha.x, y, 510, rowHeight).fill();
        doc.fillColor('black');
      }

      // Texto verticalmente centrado y truncado
      const textOpts = (col) => ({ width: col.width, align: col.align, ellipsis: true });
      doc.text(new Date(c.createdAt).toLocaleString('es-PE'), cols.fecha.x, y + 3, textOpts(cols.fecha));
      doc.text(c.oficina, cols.oficina.x, y + 3, textOpts(cols.oficina));
      doc.text(c.nombre, cols.nombre.x, y + 3, textOpts(cols.nombre));
      doc.text(c.email, cols.email.x, y + 3, textOpts(cols.email));
      doc.text(c.telefono || '—', cols.telefono.x, y + 3, textOpts(cols.telefono));

      // Bordes finos
      doc.strokeColor('#ddd').lineWidth(0.5)
         .rect(cols.fecha.x, y, 510, rowHeight).stroke();

      y += rowHeight;
    });

    // === PIE DE LA ÚLTIMA PÁGINA ===
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

// Exportar middleware requireAuth para otros archivos
router.requireAuth = requireAuth;



module.exports = router;