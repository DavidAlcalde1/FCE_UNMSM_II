const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/db');

// ============ RUTAS FIJAS (SIN /sustentaciones al inicio) ============

// Página de pregrado
router.get('/pregrado', (_req, res) => {
  res.render('sustentaciones/pregrado');
});

// Página de posgrado
router.get('/posgrado', (_req, res) => {
  res.render('sustentaciones/posgrado');
});

// ============ RUTAS PARA ESCUELAS ESPECÍFICAS ============

// Maestrías
router.get('/maestrias', (req, res) => {
  res.redirect('/sustentaciones/posgrado');
});

// Doctorados
router.get('/doctorados', (req, res) => {
  res.redirect('/sustentaciones/posgrado');
});

// Escuelas de pregrado
router.get('/economia', crearHandler('economia'));
router.get('/economia-publica', crearHandler('economia-publica'));
router.get('/economia-internacional', crearHandler('economia-internacional'));

// ============ RUTA DINÁMICA PARA OTRAS ESCUELAS (DEBE IR AL FINAL) ============

router.get('/:escuela', async (req, res) => {
  const escuela = req.params.escuela;
  
  // Lista de rutas que ya manejamos específicamente
  const rutasManejadas = [
    'pregrado', 'posgrado', 'maestrias', 'doctorados',
    'economia', 'economia-publica', 'economia-internacional'
  ];
  
  // Si es una ruta ya manejada, debería haber sido capturada antes
  // Pero por si acaso, verificamos
  if (rutasManejadas.includes(escuela)) {
    // Si llegamos aquí, es porque la ruta específica no existe
    // Redirigir a la página correspondiente
    if (escuela === 'pregrado') return res.render('sustentaciones/pregrado');
    if (escuela === 'posgrado') return res.render('sustentaciones/posgrado');
    if (escuela === 'maestrias' || escuela === 'doctorados') {
      return res.redirect('/sustentaciones/posgrado');
    }
  }
  
  // Si no es una ruta manejada, procesar como escuela
  await renderEscuela(req, res, escuela);
});

// ============ FUNCIONES AUXILIARES ============

// Función para crear handlers de escuelas
function crearHandler(escuela) {
  return async (req, res) => {
    await renderEscuela(req, res, escuela);
  };
}

// Función para renderizar una escuela
async function renderEscuela(req, res, escuela) {
  const escuelaNombre = escuela.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  try {
    const alumnos = await sequelize.query(`
      SELECT a.id, a.nombre, a.fecha, a.titulo, a.foto, 
             JSON_AGG(f.ruta) AS fotos
      FROM alumnos_sustentaciones a
      LEFT JOIN fotos_sustentaciones f ON f.alumno_id = a.id
      WHERE a.escuela = :escuela
      GROUP BY a.id, a.nombre, a.fecha, a.titulo, a.foto
      ORDER BY a.fecha DESC
    `, {
      replacements: { escuela },
      type: sequelize.QueryTypes.SELECT
    });

    res.render('sustentaciones/sustentaciones-escuela', { 
      escuelaNombre, 
      alumnos: alumnos.map(a => ({ 
        ...a, 
        fotos: a.fotos && a.fotos[0] !== null ? a.fotos : [],
        // Asegurar que la fecha se formatee correctamente
        fecha: a.fecha ? new Date(a.fecha).toLocaleDateString('es-PE') : 'Fecha no disponible'
      }))
    });
  } catch (error) {
    console.error('Error al cargar sustentaciones:', error);
    
    // Si hay error, mostrar página vacía
    res.render('sustentaciones/sustentaciones-escuela', { 
      escuelaNombre, 
      alumnos: [],
      error: 'Error al cargar los datos'
    });
  }
}



// Galería individual de un alumno
router.get('/galeria/:id', async (req, res) => {
  const alumno = await sequelize.query(`
    SELECT a.id, a.nombre, a.titulo, a.fecha, a.escuela
    FROM alumnos_sustentaciones a
    WHERE a.id = :id
  `, {
    replacements: { id: req.params.id },
    type: sequelize.QueryTypes.SELECT,
    plain: true
  });

  if (!alumno) return res.status(404).send('Alumno no encontrado');

  const fotos = await sequelize.query(`
    SELECT ruta FROM fotos_sustentaciones
    WHERE alumno_id = :id
  `, {
    replacements: { id: req.params.id },
    type: sequelize.QueryTypes.SELECT
  });

  res.render('sustentaciones/galeria-alumno', {
    alumno,
    fotos: fotos.map(f => f.ruta)
  });
});





module.exports = router;