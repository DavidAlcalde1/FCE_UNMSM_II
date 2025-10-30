const express = require('express');
const router = express.Router();
const Noticia = require('../models/Noticia');
const Evento = require('../models/Evento');
const Comunicado = require('../models/Comunicado');
const Egresado = require('../models/Egresado');
const Maestria = require('../models/Maestria');
const Doctorado = require('../models/Doctorado');

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

// Panel principal (protegido) - Ahora es un dashboard de resumen
router.get('/', requireAuth, async (_req, res) => {
  const stats = {
    noticias: await Noticia.count(),
    eventos: await Evento.count(),
    comunicados: await Comunicado.count(),
    egresados: await Egresado.count(),
    maestrias: await Maestria.count(),
    doctorados: await Doctorado.count()
  };
  res.render('admin/dashboard', { stats });
});

// === NOTICIAS === (movido a su propia ruta de listado)
 router.get('/noticias', requireAuth, async (_req, res) => {
   const noticias = await Noticia.findAll({ order: [['fecha', 'DESC']] });
   res.render('admin/noticias', { noticias });
});

// router.get('/', requireAuth, async (_req, res) => {
//   const stats = {
//     noticias: await Noticia.count(),
//     eventos: await Evento.count(),
//     comunicados: await Comunicado.count(),
//     egresados: await Egresado.count(),
//     maestrias: await Maestria.count(),
//     doctorados: await Doctorado.count()
//   };
//   res.render('admin/dashboard', { stats });
// });

router.get('/noticias/nueva', requireAuth, (_req, res) => res.render('admin/noticia-form', { noticia: null }));
router.post('/noticias', requireAuth, async (req, res) => {
  await Noticia.create(req.body);
  res.redirect('/admin/noticias'); // ← Redirige a la lista de noticias
});
router.get('/noticias/:id/editar', requireAuth, async (req, res) => {
  const noticia = await Noticia.findByPk(req.params.id);
  res.render('admin/noticia-form', { noticia });
});
router.post('/noticias/:id', requireAuth, async (req, res) => {
  await Noticia.update(req.body, { where: { id: req.params.id } });
  res.redirect('/admin/noticias'); // ← Redirige a la lista de noticias
});
router.post('/noticias/:id/eliminar', requireAuth, async (req, res) => {
  await Noticia.destroy({ where: { id: req.params.id } });
  res.redirect('/admin/noticias'); // ← Redirige a la lista de noticias
});

// === EVENTOS === (sin cambios)
router.get('/eventos', requireAuth, async (_req, res) => {
  const eventos = await Evento.findAll({ order: [['fecha', 'DESC']] });
  res.render('admin/eventos', { eventos });
});
router.get('/eventos/nuevo', requireAuth, (_req, res) => res.render('admin/evento-form', { evento: null }));
router.post('/eventos', requireAuth, async (req, res) => {
  await Evento.create(req.body);
  res.redirect('/admin/eventos');
});
router.get('/eventos/:id/editar', requireAuth, async (req, res) => {
  const evento = await Evento.findByPk(req.params.id);
  res.render('admin/evento-form', { evento });
});
router.post('/eventos/:id', requireAuth, async (req, res) => {
  await Evento.update(req.body, { where: { id: req.params.id } });
  res.redirect('/admin/eventos');
});
router.post('/eventos/:id/eliminar', requireAuth, async (req, res) => {
  await Evento.destroy({ where: { id: req.params.id } });
  res.redirect('/admin/eventos');
});

// === COMUNICADOS === (sin cambios)
router.get('/comunicados', requireAuth, async (_req, res) => {
  const comunicados = await Comunicado.findAll({ order: [['fecha', 'DESC']] });
  res.render('admin/comunicados', { comunicados });
});
router.get('/comunicados/nuevo', requireAuth, (_req, res) => res.render('admin/comunicado-form', { comunicado: null }));
router.post('/comunicados', requireAuth, async (req, res) => {
  await Comunicado.create(req.body);
  res.redirect('/admin/comunicados');
});
router.get('/comunicados/:id/editar', requireAuth, async (req, res) => {
  const comunicado = await Comunicado.findByPk(req.params.id);
  res.render('admin/comunicado-form', { comunicado });
});
router.post('/comunicados/:id', requireAuth, async (req, res) => {
  await Comunicado.update(req.body, { where: { id: req.params.id } });
  res.redirect('/admin/comunicados');
});
router.post('/comunicados/:id/eliminar', requireAuth, async (req, res) => {
  await Comunicado.destroy({ where: { id: req.params.id } });
  res.redirect('/admin/comunicados');
});

// === EGRESADOS === (sin cambios)
router.get('/egresados', requireAuth, async (_req, res) => {
  const egresados = await Egresado.findAll();
  res.render('admin/egresados', { egresados });
});
router.get('/egresados/nuevo', requireAuth, (_req, res) => res.render('admin/egresado-form', { egresado: null }));
// router.post('/egresados', requireAuth, async (req, res) => {
//   await Egresado.create(req.body);
//   res.redirect('/admin/egresados');
// });
router.post('/egresados', requireAuth, async (req, res) => {
  // Normaliza la ruta de la imagen
  if (req.body.imagen && req.body.imagen.startsWith('img/')) {
    req.body.imagen = req.body.imagen.substring(4); // Elimina 'img/'
  }
  await Egresado.create(req.body);
  res.redirect('/admin/egresados');
});
router.get('/egresados/:id/editar', requireAuth, async (req, res) => {
  const egresado = await Egresado.findByPk(req.params.id);
  res.render('admin/egresado-form', { egresado });
});
// router.post('/egresados/:id', requireAuth, async (req, res) => {
//   await Egresado.update(req.body, { where: { id: req.params.id } });
//   res.redirect('/admin/egresados');
// });
router.post('/egresados/:id', requireAuth, async (req, res) => {
  // Normaliza la ruta de la imagen
  if (req.body.imagen && req.body.imagen.startsWith('img/')) {
    req.body.imagen = req.body.imagen.substring(4); // Elimina 'img/'
  }
  await Egresado.update(req.body, { where: { id: req.params.id } });
  res.redirect('/admin/egresados');
});
router.post('/egresados/:id/eliminar', requireAuth, async (req, res) => {
  await Egresado.destroy({ where: { id: req.params.id } });
  res.redirect('/admin/egresados');
});


// === Maestrías ===
router.get('/maestrias', requireAuth, async (_req, res) => {
  const maestrias = await Maestria.findAll();
  res.render('admin/maestrias', { maestrias });
});
router.get('/maestrias/nueva', requireAuth, (_req, res) => res.render('admin/maestria-form', { maestria: null }));
router.post('/maestrias', requireAuth, async (req, res) => {
  await Maestria.create(req.body);
  res.redirect('/admin/maestrias');
});
router.get('/maestrias/:id/editar', requireAuth, async (req, res) => {
  const maestria = await Maestria.findByPk(req.params.id);
  res.render('admin/maestria-form', { maestria });
});
router.post('/maestrias/:id', requireAuth, async (req, res) => {
  await Maestria.update(req.body, { where: { id: req.params.id } });
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
router.post('/doctorados', requireAuth, async (req, res) => {
  await Doctorado.create(req.body);
  res.redirect('/admin/doctorados');
});
router.get('/doctorados/:id/editar', requireAuth, async (req, res) => {
  const doctorado = await Doctorado.findByPk(req.params.id);
  res.render('admin/doctorado-form', { doctorado });
});
router.post('/doctorados/:id', requireAuth, async (req, res) => {
  await Doctorado.update(req.body, { where: { id: req.params.id } });
  res.redirect('/admin/doctorados');
});
router.post('/doctorados/:id/eliminar', requireAuth, async (req, res) => {
  await Doctorado.destroy({ where: { id: req.params.id } });
  res.redirect('/admin/doctorados');
});

module.exports = router;