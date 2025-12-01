const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Reclamo = require('../models/Reclamo');

// Importar middleware de autenticación del admin existente
const { requireAuth } = require('./admin');

// POST /api/reclamos - Enviar nuevo reclamo
router.post('/', async (req, res) => {
    try {
        const { nombre, dni, telefono, email, tipo, descripcion } = req.body;

        // Validaciones
        if (!nombre || !dni || !email || !tipo || !descripcion) {
            return res.status(400).json({
                success: false,
                error: 'Todos los campos obligatorios deben estar completos'
            });
        }

        // Validar formato de DNI
        if (!/^\d{8}$/.test(dni)) {
            return res.status(400).json({
                success: false,
                error: 'El DNI debe tener exactamente 8 dígitos'
            });
        }

        // Validar tipo
        const tiposValidos = ['Queja', 'Reclamo', 'Sugerencia', 'Felicitación'];
        if (!tiposValidos.includes(tipo)) {
            return res.status(400).json({
                success: false,
                error: 'Tipo de reclamo no válido'
            });
        }

        // Validar longitud de descripción
        if (descripcion.length < 10) {
            return res.status(400).json({
                success: false,
                error: 'La descripción debe tener al menos 10 caracteres'
            });
        }

        // Obtener IP y User Agent
        const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
        const userAgent = req.headers['user-agent'] || '';

        // Crear el reclamo
        const reclamo = await Reclamo.create({
            nombre: nombre.trim(),
            dni: dni.trim(),
            telefono: telefono ? telefono.trim() : null,
            email: email.trim().toLowerCase(),
            tipo,
            descripcion: descripcion.trim(),
            ip_address: ipAddress,
            user_agent: userAgent
        });

        // Respuesta exitosa
        res.status(201).json({
            success: true,
            message: 'Reclamo registrado exitosamente',
            data: {
                id: reclamo.id,
                fechaCreacion: reclamo.fecha_creacion,
                estado: reclamo.estado
            }
        });

    } catch (error) {
        console.error('Error al crear reclamo:', error);

        // Error de validación de Sequelize
        if (error.name === 'SequelizeValidationError') {
            const errores = error.errors.map(err => err.message);
            return res.status(400).json({
                success: false,
                error: 'Datos inválidos',
                detalles: errores
            });
        }

        // Error de conexión a la base de datos
        if (error.name === 'SequelizeConnectionError') {
            return res.status(503).json({
                success: false,
                error: 'Error de conexión con la base de datos. Intente más tarde.'
            });
        }

        // Error interno del servidor
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor. Intente más tarde.'
        });
    }
});

// GET /api/reclamos/estadisticas/resumen - Estadísticas generales
router.get('/estadisticas/resumen', requireAuth, async (req, res) => {
    try {
        const estadisticas = await Reclamo.obtenerEstadisticas();

        res.json({
            success: true,
            data: estadisticas
        });

    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

module.exports = router;