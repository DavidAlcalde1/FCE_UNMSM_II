const Evento = require('../models/Evento');

exports.getAll = async (_req, res) => {
  try {
    const eventos = await Evento.findAll({ order: [['fecha', 'DESC']] });
    res.json(eventos);
  } catch (error) {
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