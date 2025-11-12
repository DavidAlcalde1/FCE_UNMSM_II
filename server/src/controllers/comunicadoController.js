// server/src/controllers/comunicadoController.js
const Comunicado = require('../models/Comunicado');
const { Op } = require('sequelize');
exports.getAll = async (req, res) => {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Normalizar a medianoche
    const hoyStr = hoy.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    const oficina = req.query.oficina || "fce"; // FILTRO OFICINA
    const comunicados = await Comunicado.findAll({
      where: {
        oficina: oficina, // AGREGADO: filtro oficina
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
// ========= FUNCIONES CRUD ADMIN =========
// Crear comunicado (solo admin)
exports.create = async (req, res) => {
  try {
    const { oficina = "fce", ...datos } = req.body; // AGREGADO: oficina por defecto
    const nuevoComunicado = await Comunicado.create({
      oficina,
      ...datos
    });
    res.status(201).json(nuevoComunicado);
  } catch (error) {
    console.error('Error creando comunicado:', error);
    res.status(500).json({ error: error.message });
  }
};
// Actualizar comunicado (solo admin)
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { oficina, ...datos } = req.body;
    const comunicado = await Comunicado.findByPk(id);
    if (!comunicado) {
      return res.status(404).json({ error: 'Comunicado no encontrado' });
    }
    await comunicado.update({
      ...(oficina && { oficina }),
      ...datos
    });
    res.json(comunicado);
  } catch (error) {
    console.error('Error actualizando comunicado:', error);
    res.status(500).json({ error: error.message });
  }
};
// Eliminar comunicado (solo admin)
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const comunicado = await Comunicado.findByPk(id);
    if (!comunicado) {
      return res.status(404).json({ error: 'Comunicado no encontrado' });
    }
    await comunicado.destroy();
    res.json({ message: 'Comunicado eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando comunicado:', error);
    res.status(500).json({ error: error.message });
  }
};