const Maestria = require('../models/Maestria');

exports.getAll = async (_req, res) => {
  try {
    const maestrias = await Maestria.findAll();
    res.json(maestrias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const maestria = await Maestria.findByPk(req.params.id);
    if (!maestria) return res.status(404).json({ error: 'Maestría no encontrada' });
    res.json(maestria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};