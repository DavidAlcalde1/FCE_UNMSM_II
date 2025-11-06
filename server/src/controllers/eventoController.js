const Evento = require('../models/Evento');

const { Op } = require('sequelize');
exports.getAll = async (_req, res) => {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Normalizar a medianoche
    const hoyStr = hoy.toISOString().split('T')[0]; // 'YYYY-MM-DD'

    const eventos = await Evento.findAll({
      where: {
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