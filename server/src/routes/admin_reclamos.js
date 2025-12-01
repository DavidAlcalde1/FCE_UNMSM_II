// admin_reclamos.js - Rutas administrativas para gestión de reclamos
const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Reclamo = require('../models/Reclamo');
const { requireAuth } = require('./admin');

// GET /admin/reclamos - Listar todos los reclamos
router.get('/', requireAuth, async (req, res) => {
    try {
        const { page = 1, limit = 10, estado, tipo, buscar } = req.query;
        const offset = (page - 1) * limit;

        // Construir filtros
        const where = {};
        if (estado) where.estado = estado;
        if (tipo) where.tipo = tipo;
        if (buscar) {
            where[Op.or] = [
                { nombre: { [Op.iLike]: `%${buscar}%` } },
                { dni: { [Op.iLike]: `%${buscar}%` } },
                { email: { [Op.iLike]: `%${buscar}%` } }
            ];
        }

        // Obtener reclamos con paginación
        const { rows: reclamos, count: total } = await Reclamo.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['fecha_creacion', 'DESC']]
        });

        // Calcular paginación
        const totalPages = Math.ceil(total / limit);
        const currentPage = parseInt(page);

        res.render('admin/reclamos', {
            title: 'Gestión de Reclamaciones',
            user: req.session.adminUser,
            currentPage: 'reclamos',
            reclamos,
            pagination: {
                currentPage,
                totalPages,
                total,
                hasNext: currentPage < totalPages,
                hasPrev: currentPage > 1
            },
            filtros: { estado, tipo, buscar }
        });

    } catch (error) {
        console.error('Error al listar reclamos:', error);
        res.status(500).render('admin/error', {
            title: 'Error',
            message: 'Error al cargar los reclamos',
            user: req.session.adminUser
        });
    }
});

// GET /admin/reclamos/:id - Ver detalle de un reclamo
router.get('/:id', requireAuth, async (req, res) => {
    try {
        const reclamo = await Reclamo.findByPk(req.params.id);

        if (!reclamo) {
            return res.status(404).render('admin/error', {
                title: 'Reclamo no encontrado',
                message: 'El reclamo solicitado no existe',
                user: req.session.adminUser
            });
        }

        res.render('admin/reclamo_detalle', {
            title: `Reclamo #${reclamo.id}`,
            user: req.session.adminUser,
            currentPage: 'reclamos',
            reclamo
        });

    } catch (error) {
        console.error('Error al obtener reclamo:', error);
        res.status(500).render('admin/error', {
            title: 'Error',
            message: 'Error al cargar el reclamo',
            user: req.session.adminUser
        });
    }
});

// POST /admin/reclamos/:id/responder - Responder un reclamo
router.post('/:id/responder', requireAuth, async (req, res) => {
    try {
        const { respuesta, nuevoEstado } = req.body;

        if (!respuesta || respuesta.trim().length < 10) {
            return res.status(400).json({
                success: false,
                error: 'La respuesta debe tener al menos 10 caracteres'
            });
        }

        const reclamo = await Reclamo.findByPk(req.params.id);

        if (!reclamo) {
            return res.status(404).json({
                success: false,
                error: 'Reclamo no encontrado'
            });
        }

        // Actualizar reclamo
        await reclamo.update({
            respuesta: respuesta.trim(),
            estado: nuevoEstado || 'procesado',
            fecha_respuesta: new Date(),
            respondido_por: req.session.adminUser.id
        });

        res.json({
            success: true,
            message: 'Respuesta enviada exitosamente'
        });

    } catch (error) {
        console.error('Error al responder reclamo:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// POST /admin/reclamos/:id/cambiar-estado - Cambiar estado
router.post('/:id/cambiar-estado', requireAuth, async (req, res) => {
    try {
        const { estado } = req.body;

        const estadosValidos = ['pendiente', 'en_proceso', 'resuelto', 'cerrado'];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({
                success: false,
                error: 'Estado no válido'
            });
        }

        const reclamo = await Reclamo.findByPk(req.params.id);

        if (!reclamo) {
            return res.status(404).json({
                success: false,
                error: 'Reclamo no encontrado'
            });
        }

        await reclamo.update({ estado });

        res.json({
            success: true,
            message: 'Estado actualizado exitosamente'
        });

    } catch (error) {
        console.error('Error al cambiar estado:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

module.exports = router;