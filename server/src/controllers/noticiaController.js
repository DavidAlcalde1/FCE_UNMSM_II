// server/src/controllers/noticiaController.js
const Noticia = require('../models/Noticia');

exports.getAll = async (_req, res) => {
  try {
    // ✅ Ordenar por fecha descendente (más reciente primero)
    const noticias = await Noticia.findAll({
      order: [['fecha', 'DESC']]
    });
    res.json(noticias);
  } catch (error) {
    console.error('Error al obtener noticias:', error);
    res.status(500).json({ error: 'Error al obtener las noticias' });
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