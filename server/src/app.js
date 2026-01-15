// ==========================================
//  FCE-UNMSM – BACKEND PRINCIPAL (Docker)
//  Puerto: 4000  →  nginx redirige desde 80
// ==========================================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const sequelize = require('./config/db');

// ---------- RUTAS ----------
const noticiaRoute       = require('./routes/noticias');
const posgradoRoute      = require('./routes/posgrado');
const comunicadoRoute    = require('./routes/comunicados');
const eventoRoute        = require('./routes/eventos');
const egresadoRoute      = require('./routes/egresados');
const adminRoute         = require('./routes/admin');              // login
const contactoRoute      = require('./routes/contacto');
const reclamosRoutes     = require('./routes/reclamos');           // ← API pública  POST /api/reclamos
const adminReclamosRoute = require('./routes/admin_reclamos');     // ← CRUD admin
const adminDashboardRoute= require('./routes/admin_dashboard');    // ← home admin
const sustentacionesRouter = require('./routes/sustentaciones');

// ---------- APP ----------
const app = express();

// ---------- MIDDLEWARES ----------
app.use(cors());
app.use(express.json());                       // ← importante: JSON
app.use(express.urlencoded({ extended: true })); // ← importante: form-data
app.use(session({
  secret: process.env.SESSION_SECRET || 'fce-unmsm-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }   // true solo con HTTPS
}));


app.use(express.static(path.join(__dirname, '..', 'public')));

// ---------- MOTOR DE VISTAS ----------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

// ---------- API PÚBLICA (sin auth) ----------
app.use('/api/noticias',  noticiaRoute);
app.use('/api/comunicados', comunicadoRoute);
app.use('/api/eventos',   eventoRoute);
app.use('/api/egresados', egresadoRoute);
app.use('/api/posgrado',  posgradoRoute);
app.use('/api/contacto',  contactoRoute);
app.use('/api/reclamos',  reclamosRoutes);   // ← POST /api/reclamos
app.use('/sustentaciones', sustentacionesRouter);

// ---------- ADMIN (con auth) ----------
app.use('/admin', adminRoute);           // login
app.use('/admin', adminDashboardRoute);  // dashboard
app.use('/admin/reclamos', adminReclamosRoute); // gestión

// ---------- HEALTH ----------
app.get('/api', (_req, res) => res.send('API FCE-UNMSM v1'));
app.get('/', (_req, res) => res.json({
  message: 'FCE UNMSM – Sistema de Reclamaciones',
  version: '1.0.0',
  endpoints: {
    'GET /': 'API principal',
    'GET /api': 'Health check',
    'POST /api/reclamos': 'Crear nueva reclamación',
    'GET /api/reclamos/estadisticas': 'Estadísticas (requiere auth)',
    'GET /admin': 'Dashboard principal (requiere auth)',
    'GET /admin/login': 'Login admin',
    'GET /admin/reclamos': 'Gestión de reclamaciones (requiere auth)'
  }
}));





// ---------- LISTAR RUTAS (temporal, solo para debug) ----------
app.get('/debug/rutas', (_req, res) => {
  const rutas = app._router
    ? app._router.stack
        .filter(l => l.route)
        .map(l => l.route.path)
    : [];
  res.json(rutas);
});




// ---------- SERVIDOR ----------
const PORT = process.env.PORT || 4000;
sequelize.sync({ force: false })
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Servidor corriendo en http://0.0.0.0:${PORT}`);
      console.log(`✅ Accede a la API en http://localhost/api`);
      console.log(`✅ Panel admin en http://localhost/admin`);
      console.log(`✅ Gestión reclamos en http://localhost/admin/reclamos`);
      console.log(`✅ API Reclamaciones en http://localhost/api/reclamos`);
    });
  })
  .catch(err => console.error('❌ Error al conectar con la base de datos:', err));

module.exports = app;