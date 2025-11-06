const Comunicado = require('../models/Comunicado');

const { Op } = require('sequelize');
exports.getAll = async (_req, res) => {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Normalizar a medianoche
    const hoyStr = hoy.toISOString().split('T')[0]; // 'YYYY-MM-DD'

    const comunicados = await Comunicado.findAll({
      where: {
        [Op.or]: [
          { fecha_vencimiento: null }, // Sin fecha de vencimiento → siempre vigente
          { fecha_vencimiento: { [Op.gte]: hoyStr } } // Vence hoy o después
        ]
      },
      order: [['fecha', 'DESC']]
    });

    res.json(comunicados);
  } catch (error) {
    console.error('Error en getAll de comunicados:', error);
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