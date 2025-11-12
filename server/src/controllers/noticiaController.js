// server/src/controllers/noticiaController.js
const Noticia = require('../models/Noticia');
const { Op } = require('sequelize');
exports.getAll = async (req, res) => {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Normalizar a medianoche
    const hoyStr = hoy.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    const oficina = req.query.oficina || "fce"; // FILTRO OFICINA
    const noticias = await Noticia.findAll({
      where: {
        oficina: oficina, // AGREGADO: filtro oficina
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
    console.error('Error en getById de noticias:', error);
    res.status(500).json({ error: error.message });
  }
};
// ========= FUNCIONES CRUD ADMIN =========
// Crear noticia (solo admin)
exports.create = async (req, res) => {
  try {
    const { oficina = "fce", ...datos } = req.body; // AGREGADO: oficina por defecto
    const nuevaNoticia = await Noticia.create({
      oficina,
      ...datos
    });
    res.status(201).json(nuevaNoticia);
  } catch (error) {
    console.error('Error creando noticia:', error);
    res.status(500).json({ error: error.message });
  }
};
// Actualizar noticia (solo admin)
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { oficina, ...datos } = req.body;
    const noticia = await Noticia.findByPk(id);
    if (!noticia) {
      return res.status(404).json({ error: 'Noticia no encontrada' });
    }
    await noticia.update({
      ...(oficina && { oficina }), // Actualizar oficina solo si se proporciona
      ...datos
    });
    res.json(noticia);
  } catch (error) {
    console.error('Error actualizando noticia:', error);
    res.status(500).json({ error: error.message });
  }
};
// Eliminar noticia (solo admin)
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const noticia = await Noticia.findByPk(id);
    if (!noticia) {
      return res.status(404).json({ error: 'Noticia no encontrada' });
    }
    await noticia.destroy();
    res.json({ message: 'Noticia eliminada exitosamente' });
  } catch (error) {
    console.error('Error eliminando noticia:', error);
    res.status(500).json({ error: error.message });
  }
};