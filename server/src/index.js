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
const adminRoute = require('./routes/admin');
const contactoRoute = require('./routes/contacto');

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

// Rutas
app.use('/api/noticias', noticiaRoute);
app.use('/api/comunicados', comunicadoRoute);
app.use('/api/eventos', eventoRoute);
app.use('/api/egresados', egresadoRoute);
app.use('/api/posgrado', posgradoRoute);
app.use('/admin', adminRoute);
app.use('/api/contacto', contactoRoute);


// Health-check
app.get('/api', (_req, res) => {
  res.send('API FCE-UNMSM v1');
});

const PORT = process.env.PORT || 4000;

// Iniciar servidor
sequelize.sync({ force: false }).then(() => {
  // 👇 ESCUCHAR EN 0.0.0.0 (imprescindible en Docker)
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor corriendo en http://0.0.0.0:${PORT}`);
    console.log(`✅ Accede a la API en http://localhost/api`);
    console.log(`✅ Panel admin en http://localhost/admin/login`);
  });
}).catch(err => {
  console.error('❌ Error al conectar con la base de datos:', err);
});