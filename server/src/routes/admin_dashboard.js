// admin_dashboard.js - Dashboard principal del panel de administración
const express = require('express');
const router = express.Router();
const { requireAuth } = require('./admin');

// GET /admin - Dashboard principal
router.get('/', requireAuth, (req, res) => {
    res.render('admin/dashboard', {
        title: 'Panel de Administración - Dashboard',
        user: req.session.adminUser,
        currentPage: 'dashboard'
    });
});

// GET /admin/home - Alternativa al dashboard principal
router.get('/home', requireAuth, (req, res) => {
    res.render('admin/dashboard', {
        title: 'Panel de Administración - Inicio',
        user: req.session.adminUser,
        currentPage: 'dashboard'
    });
});

// GET /admin/perfil - Ver perfil del usuario admin
router.get('/perfil', requireAuth, (req, res) => {
    res.render('admin/perfil', {
        title: 'Mi Perfil de Administrador',
        user: req.session.adminUser,
        currentPage: 'perfil'
    });
});

// GET /admin/estadisticas - Estadísticas generales del sistema
router.get('/estadisticas', requireAuth, async (req, res) => {
    try {
        // Aquí puedes agregar lógica para obtener estadísticas generales
        // Por ejemplo: total de usuarios, reclamos, etc.
        
        res.render('admin/estadisticas', {
            title: 'Estadísticas del Sistema',
            user: req.session.adminUser,
            currentPage: 'estadisticas'
        });

    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        res.status(500).render('admin/error', {
            title: 'Error',
            message: 'Error al cargar las estadísticas',
            user: req.session.adminUser
        });
    }
});

// GET /admin/configuracion - Configuración del sistema
router.get('/configuracion', requireAuth, (req, res) => {
    res.render('admin/configuracion', {
        title: 'Configuración del Sistema',
        user: req.session.adminUser,
        currentPage: 'configuracion'
    });
});

// GET /admin/logs - Ver logs del sistema (solo super admin)
router.get('/logs', requireAuth, (req, res) => {
    // Verificar si es super admin
    if (req.session.adminUser.role !== 'super_admin') {
        return res.status(403).render('admin/error', {
            title: 'Acceso Denegado',
            message: 'No tiene permisos para ver los logs del sistema',
            user: req.session.adminUser
        });
    }

    res.render('admin/logs', {
        title: 'Logs del Sistema',
        user: req.session.adminUser,
        currentPage: 'logs'
    });
});

// POST /admin/logout - Cerrar sesión
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).json({
                success: false,
                error: 'Error al cerrar sesión'
            });
        }
        res.redirect('/admin/login');
    });
});

module.exports = router;