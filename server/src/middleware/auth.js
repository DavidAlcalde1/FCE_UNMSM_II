const Admin = require('../models/Admin');

// Middleware: verifica si el admin está autenticado
async function requireAuth(req, res, next) {
    if (req.session?.adminId) {
        // Verificar que el admin aún existe y está activo
        const admin = await Admin.findByPk(req.session.adminId);
        if (admin && admin.activo) {
            req.admin = admin; // Guardar admin en request para uso posterior
            return next();
        }
    }

    // Si es petición AJAX/API, devolver JSON
    if (req.xhr || req.path.startsWith('/api/')) {
        return res.status(401).json({ error: 'No autenticado' });
    }

    // Redirigir a login
    res.redirect('/admin/login');
}

// Middleware: verifica que el admin sea super_admin
function requireSuperAdmin(req, res, next) {
    if (req.admin && req.admin.role === 'super_admin') {
        return next();
    }

    if (req.xhr || req.path.startsWith('/api/')) {
        return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de super administrador.' });
    }

    res.status(403).render('admin/error', {
        error: 'Acceso denegado. No tienes permisos de super administrador.'
    });
}

// Middleware: verifica acceso a una oficina específica
function requireOficinaAccess(oficinaPermitida) {
    return async (req, res, next) => {
        // Super admin tiene acceso a todo
        if (req.admin.role === 'super_admin') {
            return next();
        }

        // Admin de oficina: debe coincidir su oficina
        if (req.admin.oficina === oficinaPermitida) {
            return next();
        }

        // Si viene en params o query
        const oficinaSolicitada = req.params.oficina || req.query.oficina;
        if (oficinaSolicitada && req.admin.oficina === oficinaSolicitada) {
            return next();
        }

        if (req.xhr || req.path.startsWith('/api/')) {
            return res.status(403).json({
                error: 'No tienes permiso para acceder a datos de esta oficina'
            });
        }

        res.status(403).render('admin/error', {
            error: 'No tienes permiso para acceder a esta sección'
        });
    };
}

// Middleware: filtra consultas por oficina automáticamente
function filtrarPorOficina(req, res, next) {
    if (req.admin && req.admin.role === 'oficina_admin') {
        // Para admins de oficina, añadir filtro a todas las consultas
        req.oficinaFiltro = req.admin.oficina;
    } else {
        req.oficinaFiltro = null; // Super admin ve todo
    }
    next();
}

module.exports = {
    requireAuth,
    requireSuperAdmin,
    requireOficinaAccess,
    filtrarPorOficina
};