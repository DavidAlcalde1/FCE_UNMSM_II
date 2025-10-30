const Doctorado = require('../models/Doctorado');

exports.getAll = async (_req, res) => {
  try {
    const doctorados = await Doctorado.findAll();
    res.json(doctorados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const doctorado = await Doctorado.findByPk(req.params.id);
    if (!doctorado) return res.status(404).json({ error: 'Doctorado no encontrado' });
    res.json(doctorado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};