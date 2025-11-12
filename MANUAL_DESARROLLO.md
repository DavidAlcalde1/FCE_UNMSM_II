# 🛠️ MANUAL DE DESARROLLO - FCE_UNMSM_II

## 🎯 Propósito

Este manual proporciona una guía completa para desarrolladores que trabajen con el sistema FCE_UNMSM_II, incluyendo arquitectura, flujo de trabajo, convenciones de código y mejores prácticas.

## 🏗️ Arquitectura del Sistema

### **Visión General**
```
┌─────────────────────────────────────────────────────────────┐
│                     FCE_UNMSM_II Architecture               │
├─────────────────────────────────────────────────────────────┤
│  Frontend (Client)    │  Backend (Server)   │  Database     │
│  ┌─────────────────┐  │  ┌──────────────┐  │  ┌───────────┐ │
│  │   HTML/CSS/JS   │  │  │  Express.js  │  │  │PostgreSQL │ │
│  │   - index.html  │  │  │  - Routes    │  │  │    15     │ │
│  │   - admin/      │  │  │  - Models    │  │  │ - Schema  │ │
│  │   - components  │  │  │  - Views(EJS)│  │  │ - Data    │ │
│  └─────────────────┘  │  └──────────────┘  │  └───────────┘ │
├─────────────────────────────────────────────────────────────┤
│                     Docker Compose                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │     db      │  │    api      │  │      nginx          │ │
│  │ PostgreSQL  │  │  Node.js    │  │  Reverse Proxy      │ │
│  │     15      │  │ Express     │  │  (Producción)       │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### **Stack Tecnológico Detallado**

#### **Backend Stack**
```yaml
Runtime: Node.js 18+
Framework: Express.js 5.1.0
Database: PostgreSQL 15
ORM: Sequelize 6.37.7
Templating: EJS 3.1.10
Session: express-session 1.18.2
File Upload: multer 2.0.2
Email: nodemailer 7.0.10
PDF: pdfkit 0.17.2
Environment: dotenv 17.2.3
CORS: cors 2.8.5
Development: nodemon 3.1.10
CLI: sequelize-cli 6.6.3
```

#### **Database Schema**
```sql
-- Esquema principal de la base de datos
CREATE TABLE noticias (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT,
    imagen VARCHAR(255),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE eventos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha DATE,
    hora TIME,
    lugar VARCHAR(255),
    imagen VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comunicados (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT,
    imagen VARCHAR(255),
    archivo VARCHAR(255),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE egresados (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    carrera VARCHAR(255),
    año_graduacion INTEGER,
    imagen VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE maestrias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    duracion VARCHAR(255),
    modalidad VARCHAR(255),
    imagen VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE doctorados (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    duracion VARCHAR(255),
    modalidad VARCHAR(255),
    imagen VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contactos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    oficina VARCHAR(100),
    mensaje TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📁 Estructura de Directorios

### **Organización del Proyecto**

```
FCE_UNMSM_II/
├── 📄 docker-compose.yml          # Orquestación de servicios
├── 📄 .env.example               # Plantilla de variables
├── 📄 README.md                  # Documentación principal
├── 📄 LICENSE                    # Licencia ISC
│
├── 📁 server/                    # Backend Node.js
│   ├── 📄 package.json          # Dependencias y scripts
│   ├── 📄 package-lock.json     # Versiones exactas
│   ├── 📄 .env                  # Variables de entorno
│   ├── 📄 Dockerfile            # Imagen del servidor
│   │
│   ├── 📁 src/                  # Código fuente
│   │   ├── 📄 index.js          # Punto de entrada
│   │   └── 📄 db.js             # Configuración BD
│   │
│   ├── 📁 models/               # Modelos Sequelize
│   │   ├── 📄 Noticia.js        # Modelo Noticias
│   │   ├── 📄 Evento.js         # Modelo Eventos
│   │   ├── 📄 Comunicado.js     # Modelo Comunicados
│   │   ├── 📄 Egresado.js       # Modelo Egresados
│   │   ├── 📄 Maestria.js       # Modelo Maestrías
│   │   ├── 📄 Doctorado.js      # Modelo Doctorados
│   │   └── 📄 Contacto.js       # Modelo Contactos
│   │
│   ├── 📁 routes/               # Rutas API
│   │   ├── 📄 noticias.js       # Rutas de noticias
│   │   ├── 📄 eventos.js        # Rutas de eventos
│   │   ├── 📄 comunicados.js    # Rutas de comunicados
│   │   ├── 📄 egresados.js      # Rutas de egresados
│   │   ├── 📄 posgrado.js       # Rutas de posgrados
│   │   ├── 📄 contacto.js       # Rutas de contacto
│   │   └── 📄 admin.js          # Panel administrativo
│   │
│   ├── 📁 middleware/           # Middlewares personalizados
│   │   ├── 📄 auth.js           # Autenticación
│   │   └── 📄 upload.js         # Subida de archivos
│   │
│   └── 📁 views/                # Vistas EJS
│       ├── 📄 layout.ejs        # Layout principal
│       ├── 📄 index.ejs         # Página principal
│       └── 📁 admin/            # Vistas del admin
│           ├── 📄 login.ejs     # Login admin
│           ├── 📄 dashboard.ejs # Dashboard
│           └── 📄 *.ejs         # Otras vistas
│
├── 📁 client/                    # Frontend estático
│   ├── 📄 index.html            # Página principal
│   ├── 📁 css/                  # Hojas de estilo
│   │   ├── 📄 main.css          # Estilos principales
│   │   ├── 📄 admin.css         # Estilos admin
│   │   └── 📄 components.css    # Componentes
│   ├── 📁 js/                   # JavaScript
│   │   ├── 📄 main.js           # JavaScript principal
│   │   ├── 📄 admin.js          # JavaScript admin
│   │   └── 📄 components.js     # Componentes JS
│   ├── 📁 img/                  # Imágenes
│   │   ├── 📁 index/            # Imágenes principales
│   │   └── 📁 admin/            # Imágenes admin
│   └── 📁 docs/                 # Documentos PDF
│       └── 📁 comunicados/      # PDFs de comunicados
│
├── 📁 uploads/                   # Archivos subidos
│   ├── 📁 noticias/             # Imágenes de noticias
│   ├── 📁 eventos/              # Imágenes de eventos
│   ├── 📁 comunicados/          # Archivos de comunicados
│   └── 📁 egresados/            # Imágenes de egresados
│
└── 📁 nginx/                    # Configuración Nginx
    └── 📄 default.conf          # Configuración por defecto
```

---

## 🚀 Flujo de Desarrollo

### **Configuración Inicial**

```bash
# 1. Clonar repositorio
git clone https://github.com/DavidAlcalde1/FCE_UNMSM_II.git
cd FCE_UNMSM_II

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 3. Instalar dependencias
cd server
npm ci

# 4. Levantar servicios
cd ..
docker-compose up -d

# 5. Verificar funcionamiento
curl http://localhost:4000/api
```

### **Workflow de Desarrollo Diario**

```bash
# 1. Levantar servicios
docker-compose up -d

# 2. Acceder al código
docker-compose exec api sh
# Dentro del contenedor:
npm run dev

# 3. En otra terminal - ver logs
docker-compose logs -f

# 4. Desarrollo activo
# - Editar archivos en server/
# - Los cambios se reflejan automáticamente
# - Ver resultados en http://localhost:4000

# 5. Detener al final del día
docker-compose down
```

---

## 💻 Convenciones de Código

### **Estructura de Archivos**

#### **Modelo (models/Noticia.js)**
```javascript
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Noticia = sequelize.define('Noticia', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255]
      }
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    imagen: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'noticias',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });

  return Noticia;
};
```

#### **Ruta (routes/noticias.js)**
```javascript
const express = require('express');
const router = express.Router();
const Noticia = require('../models/Noticia');

// GET /api/noticias - Listar todas las noticias
router.get('/', async (req, res) => {
  try {
    const noticias = await Noticia.findAll({
      order: [['fecha', 'DESC']],
      limit: 50
    });
    res.json(noticias);
  } catch (error) {
    console.error('Error fetching noticias:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/noticias/:id - Obtener noticia específica
router.get('/:id', async (req, res) => {
  try {
    const noticia = await Noticia.findByPk(req.params.id);
    if (!noticia) {
      return res.status(404).json({ error: 'Noticia no encontrada' });
    }
    res.json(noticia);
  } catch (error) {
    console.error('Error fetching noticia:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/noticias - Crear nueva noticia
router.post('/', async (req, res) => {
  try {
    const { titulo, contenido, imagen } = req.body;
    
    if (!titulo || titulo.trim() === '') {
      return res.status(400).json({ error: 'El título es requerido' });
    }

    const noticia = await Noticia.create({
      titulo: titulo.trim(),
      contenido: contenido || null,
      imagen: imagen || null
    });

    res.status(201).json(noticia);
  } catch (error) {
    console.error('Error creating noticia:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
```

#### **Controlador de Admin (routes/admin.js - extract)**
```javascript
// Middleware: procesa el LOGIN (solo POST)
function handleLogin(req, res, next) {
  const { user, pass } = req.body;
  
  // Validar que existen las credenciales
  if (!user || !pass) {
    return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
  }
  
  // Comparar con variables de entorno
  if (user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS) {
    req.session.adminAuthenticated = true;
    return next();
  }
  
  return res.status(401).json({ error: 'Credenciales inválidas' });
}

// Login: muestra formulario (GET)
router.get('/login', (req, res) => {
  if (req.session?.adminAuthenticated) {
    return res.redirect('/admin');
  }
  res.render('admin/login');
});
```

### **Convenciones de Nomenclatura**

#### **Variables y Funciones**
```javascript
// ✅ Correcto
const usuarioActivo = true;
const listaDeNoticias = [];
const obtenerNoticias = () => {};
const procesarFormulario = (datos) => {};

// ❌ Incorrecto
const usuarioactivo = true;
const ListaDeNoticias = [];
const ObtenerNoticias = () => {};
const procesa_formulario = (datos) => {};
```

#### **Constantes**
```javascript
// ✅ Correcto
const ESTADO_ACTIVO = 'activo';
const LIMITE_REGISTROS = 100;
const FORMATO_FECHA = 'YYYY-MM-DD';

// ❌ Incorrecto
const estadoActivo = 'activo';
const limiteRegistros = 100;
const formato_fecha = 'YYYY-MM-DD';
```

#### **Archivos**
```javascript
// ✅ Correcto
noticia.js          // Modelo
noticias.js         // Rutas
noticiaService.js   // Servicios
noticias.test.js    // Tests

// ❌ Incorrecto
Noticia.js
NoticiasRoutes.js
noticias_servicio.js
test_noticias.js
```

---

## 🧪 Testing y Debugging

### **Estrategia de Testing**

#### **Test Unitario (models/Noticia.test.js)**
```javascript
const { Noticia } = require('../models');

describe('Model: Noticia', () => {
  test('debería crear una noticia válida', async () => {
    const data = {
      titulo: 'Noticia de Prueba',
      contenido: 'Contenido de prueba'
    };

    const noticia = await Noticia.create(data);
    
    expect(noticia.titulo).toBe(data.titulo);
    expect(noticia.contenido).toBe(data.contenido);
  });

  test('debería requerir título', async () => {
    await expect(Noticia.create({ contenido: 'Sin título' }))
      .rejects.toThrow();
  });
});
```

#### **Test de Integración (routes/noticias.test.js)**
```javascript
const request = require('supertest');
const app = require('../src/index');

describe('Routes: /api/noticias', () => {
  test('GET /api/noticias debería retornar lista de noticias', async () => {
    const response = await request(app)
      .get('/api/noticias')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /api/noticias debería crear nueva noticia', async () => {
    const noticiaData = {
      titulo: 'Nueva Noticia',
      contenido: 'Contenido de prueba'
    };

    const response = await request(app)
      .post('/api/noticias')
      .send(noticiaData)
      .expect(201);

    expect(response.body.titulo).toBe(noticiaData.titulo);
  });
});
```

### **Debugging**

#### **Logs Estructurados**
```javascript
// En las rutas
router.get('/', async (req, res) => {
  console.log('[INFO] Fetching noticias:', {
    timestamp: new Date().toISOString(),
    user: req.session?.adminAuthenticated ? 'admin' : 'anonymous',
    params: req.params
  });

  try {
    const noticias = await Noticia.findAll({
      order: [['fecha', 'DESC']]
    });

    console.log('[SUCCESS] Noticias fetched:', {
      count: noticias.length,
      timestamp: new Date().toISOString()
    });

    res.json(noticias);
  } catch (error) {
    console.error('[ERROR] Failed to fetch noticias:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
```

#### **Debugging con Node.js**
```bash
# Debugging local
node --inspect server/src/index.js

# Debugging con nodemon
node --inspect ./node_modules/.bin/nodemon src/index.js

# Debugging con Docker
docker-compose exec api node --inspect src/index.js
```

---

## 🔧 Comandos de Desarrollo

### **Scripts NPM Disponibles**

```bash
# Desarrollo
npm run dev              # Servidor con recarga automática
npm start                # Servidor producción
npm run lint             # Verificar código
npm run format           # Formatear código

# Base de datos
npm run db:migrate       # Aplicar migraciones
npm run db:seed          # Poblar datos iniciales
npm run db:reset         # Reset completo de BD
npm run db:rollback      # Revertir última migración

# Testing
npm test                 # Ejecutar tests
npm run test:watch       # Tests en modo watch
npm run test:coverage    # Reporte de cobertura

# Build y deploy
npm run build            # Preparar para producción
npm run docker:build     # Construir imagen Docker
npm run docker:push      # Subir imagen a registry
```

### **Comandos Git Recomendados**

```bash
# Setup inicial
git clone https://github.com/DavidAlcalde1/FCE_UNMSM_II.git
cd FCE_UNMSM_II
git checkout -b feature/nueva-funcionalidad

# Workflow diario
git add .
git commit -m "feat: agregar nueva funcionalidad"
git push origin feature/nueva-funcionalidad

# Merge con main
git checkout main
git pull origin main
git merge feature/nueva-funcionalidad
git branch -d feature/nueva-funcionalidad

# Comandos útiles
git status               # Ver estado
git log --oneline        # Ver historial
git diff                 # Ver cambios
git reset --soft HEAD~1  # Deshacer último commit
```

---

## 🔒 Seguridad y Validaciones

### **Validación de Datos**

#### **Validación en Rutas**
```javascript
const { body, param, validationResult } = require('express-validator');

router.post('/noticias', 
  body('titulo').isLength({ min: 1, max: 255 }).trim(),
  body('contenido').optional().isLength({ max: 5000 }),
  body('imagen').optional().isURL(),
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const noticia = await Noticia.create(req.body);
      res.status(201).json(noticia);
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);
```

#### **Sanitización de Entrada**
```javascript
const DOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

// Sanitizar HTML
const sanitizarHTML = (html) => {
  const window = new JSDOM('').window;
  const purify = DOMPurify(window);
  return purify.sanitize(html);
};

// Sanitizar texto plano
const sanitizarTexto = (texto) => {
  return texto
    .trim()
    .replace(/[<>]/g, '') // Remover < y >
    .substring(0, 5000);  // Limitar longitud
};
```

### **Autenticación y Autorización**

#### **Middleware de Autenticación**
```javascript
function requireAuth(req, res, next) {
  if (req.session?.adminAuthenticated) {
    return next();
  }
  return res.status(401).json({ error: 'No autorizado' });
}

// Uso en rutas
router.post('/admin/noticias', requireAuth, async (req, res) => {
  // Solo usuarios autenticados pueden crear noticias
});
```

#### **Validación de Sesiones**
```javascript
const session = require('express-session');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));
```

---

## 📊 Monitoreo y Performance

### **Métricas de Aplicación**

```javascript
// Middleware para medir performance
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
});
```

### **Health Checks**

```javascript
// Endpoint de health check
app.get('/health', async (req, res) => {
  try {
    // Verificar base de datos
    await sequelize.authenticate();
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
      version: process.env.npm_package_version
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    });
  }
});
```

---

## 🚀 Deployment y CI/CD

### **Pipeline de CI/CD**

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: |
        cd server
        npm ci
        
    - name: Run tests
      run: |
        cd server
        npm test
        
    - name: Run linting
      run: |
        cd server
        npm run lint

  docker-build:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Build Docker image
      run: |
        docker-compose build
        
    - name: Test Docker container
      run: |
        docker-compose up -d
        sleep 30
        curl http://localhost:4000/health
        docker-compose down
```

### **Variables de Entorno en Producción**

```bash
# .env.production
NODE_ENV=production
PORT=80
ADMIN_USER=admin_produccion
ADMIN_PASS=password_super_seguro_aqui
POSTGRES_PASSWORD=password_base_datos_seguro_aqui
SESSION_SECRET=session_secret_256_bits_muy_seguro_aqui
DATABASE_URL=postgresql://user:pass@host:port/db
```

---

## 📚 Recursos de Aprendizaje

### **Documentación Oficial**
- [Node.js](https://nodejs.org/docs/)
- [Express.js](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [Docker](https://docs.docker.com/)

### **Herramientas Recomendadas**
- **VS Code** + extensiones Node.js
- **Postman** para testing de API
- **pgAdmin** para gestión de BD
- **Docker Desktop** para contenedorización
- **Git** para control de versiones

---

## ✅ Checklist de Desarrollo

### **Antes de cada commit:**
- [ ] **Código formateado** (`npm run format`)
- [ ] **Linting pasa** (`npm run lint`)
- [ ] **Tests pasando** (`npm test`)
- [ ] **Variables de entorno** actualizadas
- [ ] **Logs estructurados** implementados
- [ ] **Validaciones** en todas las rutas
- [ ] **Documentación** actualizada

### **Antes de deployment:**
- [ ] **Variables de producción** configuradas
- [ ] **Base de datos** migrada
- [ ] **Health checks** funcionando
- [ ] **Logs de producción** configurados
- [ ] **Backup de BD** realizado
- [ ] **SSL/HTTPS** configurado

---

**🛠️ ¡Manual de desarrollo completo! Tu equipo tiene toda la información necesaria para trabajar eficientemente con FCE_UNMSM_II.**