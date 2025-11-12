# 📋 GUÍA DE INSTALACIÓN - FCE_UNMSM_II

## 🎯 Propósito

Esta guía proporciona instrucciones detalladas para instalar y configurar el sistema FCE_UNMSM_II en diferentes entornos (desarrollo, testing, producción).

## ⏱️ Tiempo Estimado
- **Desarrollo local:** 15-20 minutos
- **Docker:** 10-15 minutos  
- **Producción:** 30-45 minutos

---

## 📋 Prerrequisitos

### **Obligatorios**
- **Node.js:** >= 18.0.0
- **npm:** >= 8.0.0
- **Git:** Última versión
- **Docker:** >= 20.10.0
- **Docker Compose:** >= 2.0.0

### **Sistema Operativo**
- ✅ **Linux** (Ubuntu 20.04+, Debian 11+)
- ✅ **Windows** (10/11 con WSL2)
- ✅ **macOS** (10.15+)

### **Herramientas de Desarrollo (Opcional)**
- **VS Code** con extensiones:
  - Node.js Extension Pack
  - Docker Extension
  - ES6 code snippets
- **PostgreSQL Client** (psql)
- **Git GUI** (opcional)

---

## 🛠️ INSTALACIÓN - DESARROLLO LOCAL

### **PASO 1: Preparar el Entorno**

#### **Verificar versiones:**
```bash
# Verificar Node.js
node --version
# Debe mostrar: v18.x.x o superior

# Verificar npm
npm --version
# Debe mostrar: 8.x.x o superior

# Verificar Git
git --version
# Debe mostrar: git version 2.x.x

# Verificar Docker
docker --version
# Debe mostrar: Docker version 20.x.x o superior

# Verificar Docker Compose
docker-compose --version
# Debe mostrar: docker-compose version 2.x.x o superior
```

#### **Si alguna versión es menor, actualizar:**

**Node.js:**
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# macOS (con Homebrew)
brew install node@18

# Windows
# Descargar desde https://nodejs.org/
```

**Docker:**
```bash
# Ubuntu
sudo apt update
sudo apt install docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker

# macOS
# Descargar Docker Desktop desde https://www.docker.com/products/docker-desktop
```

---

### **PASO 2: Clonar y Configurar**

```bash
# Clonar repositorio
git clone https://github.com/DavidAlcalde1/FCE_UNMSM_II.git
cd FCE_UNMSM_II

# Verificar estructura
ls -la
```

**Estructura esperada:**
```
FCE_UNMSM_II/
├── docker-compose.yml
├── .env.example
├── README.md
├── server/
├── client/
└── ...
```

---

### **PASO 3: Configurar Variables de Entorno**

```bash
# Copiar plantilla
cp .env.example .env

# Editar configuración (OBLIGATORIO)
nano .env  # o vim .env o code .env
```

**Variables MÍNIMAS requeridas:**
```bash
# === CREDENCIALES DE ADMIN (OBLIGATORIO) ===
ADMIN_USER=fce_admin
ADMIN_PASS=tu_contraseña_segura_aqui

# === BASE DE DATOS ===
POSTGRES_PASSWORD=tu_password_seguro_aqui

# === SESIONES ===
SESSION_SECRET=genera_un_string_aleatorio_muy_largo_aqui
```

**🎯 Para generar SESSION_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### **PASO 4: Instalar Dependencias**

#### **Opción A: Instalación Limpia (Recomendada)**
```bash
# Ir a carpeta server
cd server

# Verificar que existe package.json
ls -la package.json

# Instalar con npm ci (limpio y rápido)
npm ci

# Verificar instalación
ls -la node_modules | head -5
```

#### **Opción B: Instalación Tradicional**
```bash
cd server
npm install
```

---

### **PASO 5: Configurar Base de Datos Local**

#### **Opción A: Con Docker (Recomendado)**
```bash
# Desde la raíz del proyecto:
docker-compose up -d

# Verificar que los contenedores están corriendo
docker-compose ps

# Ver logs si hay problemas
docker-compose logs -f
```

#### **Opción B: PostgreSQL Local**
```bash
# Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib

# Iniciar servicio
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Crear base de datos
sudo -u postgres createdb fce_db
sudo -u postgres createuser fce_user

# Establecer contraseña
sudo -u postgres psql
\password fce_user
# Enter password: secret
```

---

### **PASO 6: Probar Instalación**

```bash
# Método 1: Con Docker
docker-compose up -d
curl http://localhost:4000/api

# Método 2: Local
cd server
npm run dev
# En otra terminal:
curl http://localhost:4000/api

# Verificar panel admin
curl http://localhost:4000/admin/login
```

---

## 🐳 INSTALACIÓN - DOCKER

### **Instalación Rápida con Docker**

```bash
# 1. Clonar y configurar
git clone https://github.com/DavidAlcalde1/FCE_UNMSM_II.git
cd FCE_UNMSM_II

# 2. Configurar entorno
cp .env.example .env
# Editar .env con tus credenciales

# 3. Construir y levantar
docker-compose build
docker-compose up -d

# 4. Verificar
docker-compose ps
```

### **Comandos Docker Útiles**

```bash
# Levantar servicios
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs específicos
docker-compose logs api
docker-compose logs db
docker-compose logs nginx

# Acceder a contenedores
docker-compose exec api sh
docker-compose exec db psql -U fce_user -d fce_db

# Detener servicios
docker-compose down

# Reiniciar servicios
docker-compose restart

# Reconstruir imágenes
docker-compose build --no-cache
docker-compose up -d
```

---

## 🏭 INSTALACIÓN - PRODUCCIÓN

### **PASO 1: Preparar Servidor**

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js (v18)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar Docker
sudo apt install docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker

# Agregar usuario al grupo docker
sudo usermod -aG docker $USER
# Reiniciar sesión para aplicar cambios
```

### **PASO 2: Configurar Proyecto**

```bash
# Clonar en servidor
git clone https://github.com/DavidAlcalde1/FCE_UNMSM_II.git
cd FCE_UNMSM_II

# Configurar variables de producción
cp .env.example .env.production

# Editar configuración de producción
nano .env.production
```

**Variables de producción:**
```bash
NODE_ENV=production
PORT=80
ADMIN_USER=admin_produccion
ADMIN_PASS=password_super_seguro_aqui
POSTGRES_PASSWORD=password_base_datos_seguro_aqui
SESSION_SECRET=session_secret_256_bits_seguro_aqui
CORS_ORIGIN=https://tu-dominio.com
```

### **PASO 3: Deployment con Docker**

```bash
# Construcción para producción
docker-compose -f docker-compose.prod.yml build

# Levantar servicios de producción
docker-compose -f docker-compose.prod.yml up -d

# Verificar estado
docker-compose -f docker-compose.prod.yml ps
```

### **PASO 4: Configurar Reverse Proxy (Nginx)**

```bash
# Instalar Nginx
sudo apt install nginx

# Configurar virtual host
sudo nano /etc/nginx/sites-available/fce-unmsm
```

**Configuración Nginx:**
```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    
    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Activar sitio
sudo ln -s /etc/nginx/sites-available/fce-unmsm /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### **PASO 5: SSL/HTTPS (Recomendado)**

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d tu-dominio.com

# Verificar renovación automática
sudo certbot renew --dry-run
```

---

## 🔧 CONFIGURACIÓN AVANZADA

### **Variables de Entorno Completas**

```bash
# === APLICACIÓN ===
NODE_ENV=development|production
PORT=4000

# === BASE DE DATOS ===
DB_NAME=fce_db
DB_USER=fce_user
DB_PASS=secret
DB_HOST=localhost
DB_PORT=5432

# === VARIABLES DOCKER ===
POSTGRES_DB=fce_db
POSTGRES_USER=fce_user
POSTGRES_PASSWORD=secret

# === AUTENTICACIÓN ===
ADMIN_USER=fce_admin
ADMIN_PASS=unmsm2025
SESSION_SECRET=session_secret_256_bits_aqui

# === EMAIL ===
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_password_app

# === CONFIGURACIÓN ===
CORS_ORIGIN=http://localhost:3000
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
```

### **Configuración Docker Avanzada**

```yaml
# docker-compose.yml con configuraciones avanzadas
version: '3.9'

services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
    restart: unless-stopped
    
  api:
    build: ./server
    environment:
      NODE_ENV: ${NODE_ENV}
      DB_HOST: db
    depends_on:
      - db
    restart: unless-stopped
    volumes:
      - ./server:/app
      - uploads_data:/app/uploads
```

---

## 🧪 VERIFICACIÓN DE INSTALACIÓN

### **Checklist de Verificación**

- [ ] **Node.js >= 18.0.0 instalado**
- [ ] **npm >= 8.0.0 instalado**
- [ ] **Docker >= 20.10.0 instalado**
- [ ] **Repositorio clonado exitosamente**
- [ ] **Variables de entorno configuradas**
- [ ] **Dependencias instaladas sin errores**
- [ ] **Base de datos funcionando**
- [ ] **Servidor inicia sin errores**
- [ ] **API responde en /api**
- [ ] **Panel admin accesible**
- [ ] **Login con credenciales funciona**
- [ ] **Subida de archivos funciona**

### **Comandos de Verificación**

```bash
# 1. Verificar versiones
node --version    # >= 18.0.0
npm --version     # >= 8.0.0
docker --version  # >= 20.10.0

# 2. Verificar estructura
ls -la
ls -la server/

# 3. Verificar instalación
cd server
npm ci --dry-run  # Verificar sin instalar

# 4. Verificar base de datos
docker-compose exec db psql -U fce_user -d fce_db -c "SELECT version();"

# 5. Verificar servidor
curl http://localhost:4000/api
# Debe responder: API FCE-UNMSM v1

# 6. Verificar admin
curl http://localhost:4000/admin/login
# Debe responder: página de login HTML

# 7. Verificar mediante navegador
# http://localhost:4000/api
# http://localhost:4000/admin/login
```

---

## ❌ TROUBLESHOOTING

### **Error: "Node.js version not supported"**
```bash
# Verificar versión actual
node --version

# Si es < 18.0.0, actualizar
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### **Error: "Docker command not found"**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install docker.io
sudo systemctl start docker
sudo systemctl enable docker

# macOS
# Instalar Docker Desktop desde docker.com
```

### **Error: "npm ci not found"**
```bash
# Actualizar npm
npm install -g npm@latest

# Verificar versión
npm --version
# Debe ser >= 8.0.0
```

### **Error: "Database connection failed"**
```bash
# Verificar que PostgreSQL está corriendo
docker-compose ps

# Verificar logs
docker-compose logs db

# Reiniciar base de datos
docker-compose restart db
```

### **Error: "Permission denied"**
```bash
# Agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Reiniciar sesión o ejecutar:
newgrp docker

# Verificar
groups $USER
```

### **Error: "Port already in use"**
```bash
# Verificar puertos en uso
sudo netstat -tulpn | grep :4000
sudo netstat -tulpn | grep :5432

# Cambiar puertos en .env
PORT=4001
DB_PORT=5433
```

### **Error: "Environment variables not loaded"**
```bash
# Verificar que .env existe
ls -la .env

# Verificar formato (sin espacios alrededor de =)
cat .env

# Verificar desde Node.js
cd server
node -e "console.log(process.env.ADMIN_USER)"
```

---

## 📈 OPTIMIZACIÓN POST-INSTALACIÓN

### **Para Desarrollo**
```bash
# Instalar herramientas de desarrollo
npm install -g nodemon eslint prettier

# Configurar editor
# Agregar .vscode/settings.json para auto-formateo
```

### **Para Producción**
```bash
# Configurar logs
sudo mkdir -p /var/log/fce-unmsm
sudo chown $USER:$USER /var/log/fce-unmsm

# Configurar backup automático
# Agregar a crontab
0 2 * * * /usr/local/bin/docker-compose -f /path/to/FCE_UNMSM_II/docker-compose.prod.yml exec db pg_dump -U fce_user fce_db > /backups/fce_db_$(date +\%Y\%m\%d).sql
```

---

## 🚀 PRÓXIMOS PASOS

Después de la instalación exitosa:

1. **📖 Leer [MANUAL DE DESARROLLO](DEVELOPMENT.md)**
2. **🔧 Configurar [ARQUITECTURA](ARCHITECTURE.md)**
3. **🔒 Revisar [SEGURIDAD](SECURITY.md)**
4. **🧪 Implementar [TESTING](TESTING.md)**

---

**✨ ¡Instalación completada! Tu sistema FCE_UNMSM_II está listo para usar.**