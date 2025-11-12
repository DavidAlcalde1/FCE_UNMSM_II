# 👤 MANUAL DE USUARIO - FCE_UNMSM_II

## 🎯 Introducción

El sistema **FCE_UNMSM_II** es una plataforma web diseñada para la gestión integral de contenido institucional de la Facultad de Ciencias Económicas de la UNMSM. Este manual te guiará paso a paso en el uso del sistema.

## 🔐 Acceso al Sistema

### **Panel de Administración**
- **URL:** http://localhost:4000/admin/login
- **Usuario:** fce_admin
- **Contraseña:** unmsm2025

### **Panel Público**
- **URL:** http://localhost:4000
- **Acceso:** Público (sin autenticación)

---

## 🎛️ Panel de Administración

### **Dashboard Principal**

Al iniciar sesión con las credenciales de administrador, verás el **Dashboard** con estadísticas en tiempo real:

#### **📊 Métricas Disponibles**
- **Noticias:** Cantidad total publicadas
- **Eventos:** Próximos y recientes
- **Comunicados:** Oficiales activos
- **Egresados:** Registrados en el sistema
- **Maestrías:** Programas disponibles
- **Doctorados:** Programas disponibles
- **Contactos:** Mensajes recibidos

#### **📈 Navegación del Dashboard**
- **Menú lateral izquierdo:** Acceso a todas las secciones
- **Barra superior:** Perfil de usuario y cerrar sesión
- **Área principal:** Estadísticas y acciones rápidas

---

## 📰 GESTIÓN DE NOTICIAS

### **Ver Lista de Noticias**

1. **Navegar:** Panel Admin → "Noticias"
2. **Ver:** Lista ordenada por fecha (más recientes primero)
3. **Información mostrada:**
   - Título de la noticia
   - Fecha de publicación
   - Imagen (si tiene)
   - Acciones disponibles

### **Crear Nueva Noticia**

1. **Acceder:** Panel Admin → "Noticias" → "Nueva Noticia"
2. **Completar formulario:**
   - **Título:** (Obligatorio) Máximo 255 caracteres
   - **Contenido:** (Opcional) Texto descriptivo
   - **Imagen:** (Opcional) Subir archivo de imagen
   - **Fecha:** (Auto) Se asigna automáticamente

3. **Subir imagen:**
   - Hacer clic en "Seleccionar archivo"
   - Elegir imagen (JPG, PNG, GIF)
   - Tamaño máximo: 5MB
   - La imagen se guardará automáticamente

4. **Publicar:**
   - Hacer clic en "Crear Noticia"
   - Redirige automáticamente a la lista

### **Editar Noticia Existente**

1. **Localizar:** Panel Admin → "Noticias"
2. **Acción:** Hacer clic en "Editar" junto a la noticia
3. **Modificar:** Cambiar título, contenido o imagen
4. **Guardar:** Hacer clic en "Actualizar Noticia"

### **Eliminar Noticia**

1. **Localizar:** Panel Admin → "Noticias"
2. **Confirmación:** Hacer clic en "Eliminar"
3. **Acción final:** Confirmar en el diálogo de seguridad
4. **Resultado:** La noticia se elimina permanentemente

---

## 📅 GESTIÓN DE EVENTOS

### **Ver Lista de Eventos**

1. **Navegar:** Panel Admin → "Eventos"
2. **Información mostrada:**
   - Título del evento
   - Fecha y hora
   - Lugar
   - Imagen (si tiene)

### **Crear Nuevo Evento**

1. **Acceder:** Panel Admin → "Eventos" → "Nuevo Evento"
2. **Completar formulario:**
   - **Título:** (Obligatorio) Nombre del evento
   - **Descripción:** (Opcional) Detalles del evento
   - **Fecha:** (Obligatorio) Fecha del evento
   - **Hora:** (Opcional) Hora del evento
   - **Lugar:** (Opcional) Ubicación
   - **Imagen:** (Opcional) Imagen promocional

3. **Publicar:**
   - Hacer clic en "Crear Evento"

### **Editar/Eliminar Eventos**
- Proceso idéntico a las noticias
- Usar botones "Editar" y "Eliminar"

---

## 📢 GESTIÓN DE COMUNICADOS

### **Ver Lista de Comunicados**

1. **Navegar:** Panel Admin → "Comunicados"
2. **Información mostrada:**
   - Título del comunicado
   - Fecha
   - Imagen (si tiene)
   - Archivo adjunto (si tiene)

### **Crear Nuevo Comunicado**

1. **Acceder:** Panel Admin → "Comunicados" → "Nuevo Comunicado"
2. **Completar formulario:**
   - **Título:** (Obligatorio) Asunto del comunicado
   - **Contenido:** (Opcional) Texto descriptivo
   - **Imagen:** (Opcional) Imagen asociada
   - **Archivo:** (Opcional) Documento PDF/Word

3. **Subir archivo:**
   - Hacer clic en "Seleccionar archivo"
   - Elegir documento (PDF, DOC, DOCX)
   - Tamaño máximo: 10MB

4. **Publicar:**
   - Hacer clic en "Crear Comunicado"

### **Gestión de Archivos**
- **Visualización:** Los archivos se muestran en la lista
- **Descarga:** Los usuarios pueden descargar desde el panel público
- **Eliminación:** Se elimina junto con el comunicado

---

## 👥 GESTIÓN DE EGRESADOS

### **Ver Lista de Egresados**

1. **Navegar:** Panel Admin → "Egresados"
2. **Información mostrada:**
   - Nombre y apellido
   - Carrera
   - Año de graduación
   - Foto (si tiene)

### **Agregar Nuevo Egresado**

1. **Acceder:** Panel Admin → "Egresados" → "Nuevo Egresado"
2. **Completar formulario:**
   - **Nombre:** (Obligatorio)
   - **Apellido:** (Obligatorio)
   - **Carrera:** (Opcional) Carrera de la FCE
   - **Año de Graduación:** (Opcional) Año de egreso
   - **Imagen:** (Opcional) Foto del egresado

3. **Publicar:**
   - Hacer clic en "Crear Egresado"

### **Gestión de Perfiles**
- **Edición:** Modificar información en cualquier momento
- **Fotos:** Usar imágenes profesionales
- **Carreras FCE:** Derecho, Economía, etc.

---

## 🎓 GESTIÓN DE POSGRADOS

### **Maestrías**

#### **Ver Maestrías Disponibles**
1. **Navegar:** Panel Admin → "Maestrías"
2. **Información mostrada:**
   - Nombre del programa
   - Descripción
   - Duración
   - Modalidad
   - Imagen promocional

#### **Crear Nueva Maestría**
1. **Acceder:** Panel Admin → "Maestrías" → "Nueva Maestría"
2. **Completar formulario:**
   - **Nombre:** (Obligatorio) Nombre del programa
   - **Descripción:** (Obligatorio) Detalles del programa
   - **Duración:** (Opcional) Tiempo de estudios
   - **Modalidad:** (Opcional) Presencial, virtual, etc.
   - **Imagen:** (Opcional) Logo o imagen del programa

### **Doctorados**

#### **Gestión de Doctorados**
- Proceso idéntico a las maestrías
- Panel Admin → "Doctorados"

---

## 📞 GESTIÓN DE CONTACTOS

### **Ver Mensajes Recibidos**

1. **Navegar:** Panel Admin → "Contactos"
2. **Filtrar por oficina:**
   - **FCE:** Facultad de Ciencias Económicas
   - **OCAA:** Oficina de Calidad Académica y Acreditación
   - **Posgrado:** Programas de posgrado
   - **CERSEU:** Centro de Estudios de la Realidad Social y Económica
   - **CESEPI:** Centro de Estudios de Política y Estrategia Institucional

3. **Información mostrada:**
   - Nombre y email del remitente
   - Teléfono (si proporcionó)
   - Oficina de interés
   - Fecha y hora
   - Mensaje completo

### **Exportar Contactos a PDF**

1. **Acceder:** Panel Admin → "Contactos"
2. **Exportar:** Hacer clic en "Exportar a PDF"
3. **Resultado:** Se descarga un PDF con todos los contactos
4. **Incluye:**
   - Encabezado institucional
   - Logo de la FCE
   - Tabla completa de contactos
   - Pie de página con créditos

### **Funciones del PDF**
- **Formato profesional** con identidad institucional
- **Estructura tabla** con columnas organizadas
- **Paginación automática** si hay muchos contactos
- **Información completa** de cada contacto

---

## 📄 EXPORTACIÓN Y REPORTES

### **Exportación de Contactos**

El sistema genera automáticamente reportes en PDF con formato profesional:

#### **Características del PDF:**
- **Encabezado:** Logo FCE + información institucional
- **Tabla organizada:** Fecha, Oficina, Nombre, Email, Teléfono
- **Diseño:** Colores institucionales (azul #1c3d6c)
- **Paginación:** Automática con numeración
- **Pie de página:** Créditos del desarrollador

#### **Para generar PDF:**
1. Ir a Panel Admin → "Contactos"
2. Hacer clic en "Exportar a PDF"
3. El archivo se descarga automáticamente

---

## 🌐 PANEL PÚBLICO

### **Página Principal**

#### **Navegación**
- **Inicio:** Información general de la FCE
- **Noticias:** Lista de noticias recientes
- **Eventos:** Calendario de eventos
- **Comunicados:** Comunicados oficiales
- **Egresados:** Directorio de egresados
- **Posgrados:** Maestrías y doctorados
- **Contacto:** Formulario para enviar mensajes

#### **Noticias Públicas**
- **Visualización:** Ordenadas por fecha (más recientes primero)
- **Información:** Título, fecha, imagen (si tiene)
- **Enlaces:** Hacer clic para ver contenido completo

#### **Eventos Públicos**
- **Lista:** Eventos ordenados cronológicamente
- **Detalles:** Título, fecha, hora, lugar, descripción
- **Imágenes:** Fotos asociadas (si tienen)

### **Formulario de Contacto**

#### **Campos Disponibles**
- **Nombre:** (Obligatorio)
- **Email:** (Obligatorio)
- **Teléfono:** (Opcional)
- **Oficina de interés:** (Obligatorio) Lista desplegable
- **Mensaje:** (Obligatorio) Consulta o comentario

#### **Envío**
1. **Completar formulario**
2. **Hacer clic:** "Enviar Mensaje"
3. **Confirmación:** Mensaje de éxito
4. **Resultado:** El mensaje llega al panel de administración

---

## 🔧 CONFIGURACIÓN Y MANTENIMIENTO

### **Gestión de Archivos**

#### **Subida de Imágenes**
- **Formatos soportados:** JPG, JPEG, PNG, GIF
- **Tamaño máximo:** 5MB por archivo
- **Resolución recomendada:** 
  - **Noticias/Eventos:** 800x600px mínimo
  - **Egresados:** 400x400px (cuadrada)
  - **Programas:** 600x400px

#### **Subida de Documentos**
- **Formatos soportados:** PDF, DOC, DOCX
- **Tamaño máximo:** 10MB por archivo
- **Ubicación:** Se almacenan en `/docs/comunicados/`

### **Backup y Seguridad**

#### **Copia de Seguridad**
- **Base de datos:** Respaldos automáticos diarios
- **Archivos:** Carpetas `uploads/` respaldadas
- **Configuración:** Archivo `.env` protegido

#### **Buenas Prácticas**
- **Contraseñas seguras:** Cambiar regularmente
- **Actualizaciones:** Mantener sistema actualizado
- **Accesos:** No compartir credenciales de admin
- **Sesiones:** Cerrar sesión al terminar

---

## ❓ FAQ - PREGUNTAS FRECUENTES

### **¿Qué formatos de imagen acepta el sistema?**
- JPG, JPEG, PNG, GIF
- Tamaño máximo: 5MB
- Resolución recomendada: 800x600px mínimo

### **¿Cómo subo un archivo PDF?**
1. Ir a la sección correspondiente
2. Hacer clic en "Seleccionar archivo"
3. Elegir archivo PDF (máximo 10MB)
4. Hacer clic en "Guardar" o "Crear"

### **¿Puedo editar una noticia después de crearla?**
Sí, hacer clic en "Editar" junto a la noticia, modificar y hacer clic en "Actualizar".

### **¿Cómo elimino permanentemente una entrada?**
Hacer clic en "Eliminar" y confirmar en el diálogo. **Esta acción es irreversible**.

### **¿Puedo filtrar los contactos por oficina?**
Sí, usar el filtro "Oficina" en la sección "Contactos" del panel admin.

### **¿Cómo exporto todos los contactos?**
Ir a Panel Admin → Contactos → "Exportar a PDF"

### **¿Qué pasa si se pierde la conexión durante la subida de archivos?**
Se puede reintentar. El archivo se subirá completo desde donde se pausó.

### **¿Puedo cambiar la contraseña de administrador?**
Sí, modificando las variables `ADMIN_USER` y `ADMIN_PASS` en el archivo `.env`.

---

## 📞 SOPORTE Y CONTACTO

### **Soporte Técnico**
- **Desarrollador:** José David Alcalde Cabrera
- **Email:** jalcaldeca@unmsm.edu.pe
- **Institución:** Universidad Nacional Mayor de San Marcos

### **Soporte de Usuario**
- **Panel de ayuda:** Disponible en el sistema
- **Documentación:** Manual completo incluido
- **Videos tutoriales:** (En desarrollo)

### **Reportar Problemas**
1. **Describir el problema** con detalle
2. **Incluir pasos** para reproducir el error
3. **Captura de pantalla** si es posible
4. **Información del navegador** y sistema operativo

---

## 📊 MÉTRICAS DE USO

### **¿Qué se mide?**
- **Notificaciones:** Registros creados/editados
- **Descargas:** Archivos descargados del sistema
- **Contactos:** Mensajes recibidos por formulario
- **Sesiones:** Tiempo de uso del panel admin

### **Dashboard Analytics**
- **Estadísticas en tiempo real** en el dashboard
- **Gráficos de tendencias** (en desarrollo)
- **Reportes de actividad** mensual

---

## 🔄 ACTUALIZACIONES FUTURAS

### **Funcionalidades Planificadas**
- **Más filtros** en listas de contenido
- **Comentarios** en noticias y eventos
- **Notificaciones push** para nuevos contenidos
- **Integración con redes sociales**
- **Panel de estadísticas avanzado**
- **API pública** para desarrolladores

### **Mejoras en Desarrollo**
- **Modo oscuro** para el panel admin
- **Drag & drop** para subida de archivos
- **Editor de texto enriquecido** para contenidos
- **Calendario visual** para eventos

---

## ✅ CHECKLIST DE USUARIO

### **Para usar el sistema efectivamente:**
- [ ] **Acceder al panel admin** con credenciales correctas
- [ ] **Familiarizarse con la navegación** lateral
- [ ] **Probar subida de archivos** antes de contenido importante
- [ ] **Usar imágenes de buena calidad** (800x600px mínimo)
- [ ] **Hacer respaldo** antes de cambios importantes
- [ ] **Revisar contactos** regularmente
- [ ] **Exportar reportes** según necesidad
- [ ] **Cerrar sesión** al terminar

---

**👤 ¡Manual de usuario completo! Ahora tienes toda la información necesaria para administrar eficientemente el sistema FCE_UNMSM_II.**