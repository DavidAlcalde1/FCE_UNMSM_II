// server/src/controllers/egresadoController.js
const Egresado = require('../models/Egresado');
exports.getAll = async (req, res) => {
  try {
    const oficina = req.query.oficina || "fce"; // FILTRO OFICINA
    const egresados = await Egresado.findAll({
      where: { oficina: oficina } // AGREGADO: filtro oficina
    });
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
// ========= FUNCIONES CRUD ADMIN =========
// Crear egresado (solo admin)
exports.create = async (req, res) => {
  try {
    const { oficina = "fce", ...datos } = req.body; // AGREGADO: oficina por defecto
    const nuevoEgresado = await Egresado.create({
      oficina,
      ...datos
    });
    res.status(201).json(nuevoEgresado);
  } catch (error) {
    console.error('Error creando egresado:', error);
    res.status(500).json({ error: error.message });
  }
};
// Actualizar egresado (solo admin)
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { oficina, ...datos } = req.body;
    const egresado = await Egresado.findByPk(id);
    if (!egresado) {
      return res.status(404).json({ error: 'Egresado no encontrado' });
    }
    await egresado.update({
      ...(oficina && { oficina }),
      ...datos
    });
    res.json(egresado);
  } catch (error) {
    console.error('Error actualizando egresado:', error);
    res.status(500).json({ error: error.message });
  }
};
// Eliminar egresado (solo admin)
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const egresado = await Egresado.findByPk(id);
    if (!egresado) {
      return res.status(404).json({ error: 'Egresado no encontrado' });
    }
    await egresado.destroy();
    res.json({ message: 'Egresado eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando egresado:', error);
    res.status(500).json({ error: error.message });
  }
};