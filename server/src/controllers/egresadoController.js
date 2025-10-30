const Egresado = require('../models/Egresado');

exports.getAll = async (_req, res) => {
  try {
    const egresados = await Egresado.findAll();
    res.json(egresados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const egresado = await Egresado.findByPk(req.params.id);
    if (!egresado) return res.status(404).json({ error: 'Egresado no encontrado' });
    res.json(egresado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};