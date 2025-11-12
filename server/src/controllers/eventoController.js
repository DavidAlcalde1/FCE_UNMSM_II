// server/src/controllers/eventoController.js
const Evento = require('../models/Evento');

const { Op } = require('sequelize');
exports.getAll = async (req, res) => {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Normalizar a medianoche
    const hoyStr = hoy.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    const oficina = req.query.oficina || "fce"; // FILTRO OFICINA

    const eventos = await Evento.findAll({
      where: {
        oficina: oficina, // AGREGADO: filtro oficina
        [Op.or]: [
          { fecha_vencimiento: null }, // Sin fecha de vencimiento → siempre vigente
          { fecha_vencimiento: { [Op.gte]: hoyStr } } // Vence hoy o después
        ]
      },
      order: [['fecha', 'DESC']]
    });

    res.json(eventos);
  } catch (error) {
    console.error('Error en getAll de eventos:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const evento = await Evento.findByPk(req.params.id);
    if (!evento) return res.status(404).json({ error: 'Evento no encontrado' });
    res.json(evento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========= FUNCIONES CRUD ADMIN =========

// Crear evento (solo admin)
exports.create = async (req, res) => {
  try {
    const { oficina = "fce", ...datos } = req.body; // AGREGADO: oficina por defecto
    const nuevoEvento = await Evento.create({
      oficina,
      ...datos
    });
    res.status(201).json(nuevoEvento);
  } catch (error) {
    console.error('Error creando evento:', error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar evento (solo admin)
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { oficina, ...datos } = req.body;
    
    const evento = await Evento.findByPk(id);
    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    await evento.update({
      ...(oficina && { oficina }),
      ...datos
    });

    res.json(evento);
  } catch (error) {
    console.error('Error actualizando evento:', error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar evento (solo admin)
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const evento = await Evento.findByPk(id);
    
    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    await evento.destroy();
    res.json({ message: 'Evento eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando evento:', error);
    res.status(500).json({ error: error.message });
  }
};