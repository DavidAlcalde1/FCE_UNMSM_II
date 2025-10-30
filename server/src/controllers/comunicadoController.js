const Comunicado = require('../models/Comunicado');

exports.getAll = async (_req, res) => {
  try {
    const comunicados = await Comunicado.findAll({ order: [['fecha', 'DESC']] });
    res.json(comunicados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const comunicado = await Comunicado.findByPk(req.params.id);
    if (!comunicado) return res.status(404).json({ error: 'Comunicado no encontrado' });
    res.json(comunicado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};