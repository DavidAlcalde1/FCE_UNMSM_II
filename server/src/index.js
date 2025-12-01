// index.js - CORREGIDO - Estructura correcta de rutas
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const sequelize = require('./config/db');

// Importar rutas
const noticiaRoute = require('./routes/noticias');
const posgradoRoute = require('./routes/posgrado');
const comunicadoRoute = require('./routes/comunicados');
const eventoRoute = require('./routes/eventos');
const egresadoRoute = require('./routes/egresados');
const adminRoute = require('./routes/admin');           // Login y autenticación
const contactoRoute = require('./routes/contacto');

// Importar rutas de reclamos - CORREGIDAS
const reclamosRoutes = require('./routes/reclamos');           // API pública
const adminReclamosRoutes = require('./routes/admin_reclamos'); // Gestión admin reclamos
const adminDashboardRoutes = require('./routes/admin_dashboard'); // Dashboard principal

// Crear app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'fce-unmsm-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // true solo si usas HTTPS en producción
}));

// Motor de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

// RUTAS API PÚBLICAS
app.use('/api/noticias', noticiaRoute);
app.use('/api/comunicados', comunicadoRoute);
app.use('/api/eventos', eventoRoute);
app.use('/api/egresados', egresadoRoute);
app.use('/api/posgrado', posgradoRoute);
app.use('/api/contacto', contactoRoute);

// RUTAS API PÚBLICAS - RECLAMOS
app.use('/api/reclamos', reclamosRoutes);

// RUTAS ADMIN - AUTENTICACIÓN
app.use('/admin', adminRoute);

// RUTAS ADMIN - DASHBOARD PRINCIPAL
app.use('/admin', adminDashboardRoutes);

// RUTAS ADMIN - GESTIÓN DE RECLAMOS
app.use('/admin/reclamos', adminReclamosRoutes);

// Health-check
app.get('/api', (_req, res) => {
  res.send('API FCE-UNMSM v1');
});

// Ruta principal de la API
app.get('/', (_req, res) => {
  res.json({
    message: 'FCE UNMSM - Sistema de Reclamaciones',
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
  });
});

const PORT = process.env.PORT || 4000;

// Iniciar servidor
sequelize.sync({ force: false }).then(() => {
  // 👇 ESCUCHAR EN 0.0.0.0 (imprescindible en Docker)
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor corriendo en http://0.0.0.0:${PORT}`);
    console.log(`✅ Accede a la API en http://localhost/api`);
    console.log(`✅ Panel admin en http://localhost/admin`);
    console.log(`✅ Gestión reclamos en http://localhost/admin/reclamos`);
    console.log(`✅ API Reclamaciones en http://localhost/api/reclamos`);
  });
}).catch(err => {
  console.error('❌ Error al conectar con la base de datos:', err);
});

module.exports = app;