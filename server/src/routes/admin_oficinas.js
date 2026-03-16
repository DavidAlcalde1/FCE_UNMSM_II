const express = require('express');
const router = express.Router();
const { requireAuth, requireOficinaAccess, filtrarPorOficina } = require('../middleware/auth');
const Contacto = require('../models/Contacto');
const { Op } = require('sequelize');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Todas las rutas requieren autenticación
router.use(requireAuth);

// Dashboard para oficina específica
router.get('/oficina/:oficina', requireOficinaAccess(), filtrarPorOficina, async (req, res) => {
    try {
        const oficina = req.params.oficina;
        const admin = req.admin;

        // Estadísticas específicas de la oficina
        const totalContactos = await Contacto.count({
            where: { oficina }
        });

        const contactosRecientes = await Contacto.count({
            where: {
                oficina,
                createdAt: {
                    [Op.gte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) // últimos 30 días
                }
            }
        });

        const ultimosContactos = await Contacto.findAll({
            where: { oficina },
            order: [['createdAt', 'DESC']],
            limit: 5
        });

        res.render('admin/oficinas/dashboard', {
            oficina,
            admin,
            estadisticas: {
                totalContactos,
                contactosRecientes
            },
            ultimosContactos,
            title: `Dashboard ${oficina.toUpperCase()}`
        });

    } catch (error) {
        console.error('Error en dashboard oficina:', error);
        res.status(500).render('admin/error', {
            error: 'Error al cargar el dashboard'
        });
    }
});

// Ver contactos de una oficina específica
router.get('/oficina/:oficina/contactos', requireOficinaAccess(), filtrarPorOficina, async (req, res) => {
    try {
        const oficina = req.params.oficina;
        const admin = req.admin;
        const { fechaInicio, fechaFin, exportar } = req.query;

        const whereClause = { oficina };

        if (fechaInicio || fechaFin) {
            whereClause.createdAt = {};
            if (fechaInicio) {
                whereClause.createdAt[Op.gte] = new Date(fechaInicio);
            }
            if (fechaFin) {
                const fechaFinDate = new Date(fechaFin);
                fechaFinDate.setHours(23, 59, 59, 999);
                whereClause.createdAt[Op.lte] = fechaFinDate;
            }
        }

        const contactos = await Contacto.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']]
        });

        // Si es solicitud de exportación
        if (exportar === 'pdf') {
            return exportarContactosPDF(contactos, oficina, req, res);
        }
        if (exportar === 'csv') {
            return exportarContactosCSV(contactos, oficina, res);
        }

        res.render('admin/oficinas/contactos', {
            oficina,
            admin,
            contactos,
            totalContactos: contactos.length,
            fechaInicio: fechaInicio || '',
            fechaFin: fechaFin || '',
            title: `Contactos - ${oficina.toUpperCase()}`
        });

    } catch (error) {
        console.error('Error cargando contactos:', error);
        res.status(500).render('admin/error', {
            error: 'Error al cargar contactos'
        });
    }
});

// Función de exportación a PDF
async function exportarContactosPDF(contactos, oficina, req, res) {
    try {
        const doc = new PDFDocument({
            size: 'A4',
            margins: { top: 50, bottom: 20, left: 45, right: 45 }
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=contactos_${oficina}.pdf`);
        doc.pipe(res);

        // Logo
        const logoPath = path.join(__dirname, '..', '..', 'client', 'img', 'index', 'logo_fce.png');
        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, 45, 40, { width: 120 });
        }

        doc.font('Helvetica-Bold').fontSize(14)
            .text('Facultad de Ciencias Económicas', 180, 50)
            .fontSize(12).text('Universidad Nacional Mayor de San Marcos', 180, 65);
        doc.moveTo(45, 90).lineTo(555, 90).stroke('#1c3d6c').lineWidth(2);
        doc.moveDown(2);

        // Título
        doc.fontSize(14).fillColor('#1c3d6c')
            .text(`Contactos - ${oficina.toUpperCase()}`, { align: 'center' });
        doc.moveDown(2);

        // Tabla simple
        const startY = 150;
        let y = startY;

        // Encabezados
        doc.font('Helvetica-Bold').fontSize(10);
        doc.text('Fecha', 45, y);
        doc.text('Nombre', 150, y);
        doc.text('Email', 280, y);
        doc.text('Teléfono', 430, y);

        y += 20;
        doc.moveTo(45, y).lineTo(555, y).stroke();
        y += 10;

        // Datos
        doc.font('Helvetica').fontSize(9);
        contactos.forEach((c, i) => {
            if (y > 750) {
                doc.addPage();
                y = 50;
            }

            const fecha = new Date(c.createdAt).toLocaleDateString('es-PE');
            doc.text(fecha, 45, y);
            doc.text(c.nombre.substring(0, 20), 150, y);
            doc.text(c.email.substring(0, 25), 280, y);
            doc.text(c.telefono || '—', 430, y);

            y += 20;
        });

        // Total
        y += 10;
        doc.font('Helvetica-Bold').fontSize(10)
            .text(`Total de registros: ${contactos.length}`, 45, y);

        doc.end();

    } catch (error) {
        console.error('Error exportando PDF:', error);
        res.status(500).send('Error al generar PDF');
    }
}

// Función de exportación a CSV
async function exportarContactosCSV(contactos, oficina, res) {
    try {
        const csvHeader = 'Fecha,Nombre,Email,Teléfono,Mensaje,Oficina\n';
        const csvData = contactos.map(c => {
            const fecha = new Date(c.createdAt).toLocaleDateString('es-PE');
            const mensaje = `"${c.mensaje.replace(/"/g, '""')}"`;
            return `"${fecha}","${c.nombre}","${c.email}","${c.telefono || ''}",${mensaje},"${c.oficina}"`;
        }).join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=contactos_${oficina}.csv`);
        res.send(csvHeader + csvData);

    } catch (error) {
        console.error('Error exportando CSV:', error);
        res.status(500).send('Error al exportar CSV');
    }
}

module.exports = router;