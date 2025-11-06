// server/src/controllers/noticiaController.js
const Noticia = require('../models/Noticia');

const { Op } = require('sequelize');
exports.getAll = async (_req, res) => {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Normalizar a medianoche
    const hoyStr = hoy.toISOString().split('T')[0]; // 'YYYY-MM-DD'

    const noticias = await Noticia.findAll({
      where: {
        [Op.or]: [
          { fecha_vencimiento: null }, // Sin fecha de vencimiento → siempre vigente
          { fecha_vencimiento: { [Op.gte]: hoyStr } } // Vence hoy o después
        ]
      },
      order: [['fecha', 'DESC']]
    });

    res.json(noticias);
  } catch (error) {
    console.error('Error en getAll de noticias:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const noticia = await Noticia.findByPk(id);
    
    if (!noticia) {
      return res.status(404).json({ error: 'Noticia no encontrada' });
    }
    
    res.json(noticia);
  } catch (error) {
    console.error('Error al obtener noticia por ID:', error);
    res.status(500).json({ error: 'Error al obtener la noticia' });
  }
};