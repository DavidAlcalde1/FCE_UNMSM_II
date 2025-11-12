// server/src/controllers/maestriaController.js
const Maestria = require('../models/Maestria');

exports.getAll = async (req, res) => {
  try {
    const oficina = req.query.oficina || "fce"; // FILTRO OFICINA
    
    const maestrias = await Maestria.findAll({
      where: { oficina: oficina } // AGREGADO: filtro oficina
    });
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

// ========= FUNCIONES CRUD ADMIN =========

// Crear maestría (solo admin)
exports.create = async (req, res) => {
  try {
    const { oficina = "fce", ...datos } = req.body; // AGREGADO: oficina por defecto
    const nuevaMaestria = await Maestria.create({
      oficina,
      ...datos
    });
    res.status(201).json(nuevaMaestria);
  } catch (error) {
    console.error('Error creando maestría:', error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar maestría (solo admin)
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { oficina, ...datos } = req.body;
    
    const maestria = await Maestria.findByPk(id);
    if (!maestria) {
      return res.status(404).json({ error: 'Maestría no encontrada' });
    }

    await maestria.update({
      ...(oficina && { oficina }),
      ...datos
    });

    res.json(maestria);
  } catch (error) {
    console.error('Error actualizando maestría:', error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar maestría (solo admin)
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const maestria = await Maestria.findByPk(id);
    
    if (!maestria) {
      return res.status(404).json({ error: 'Maestría no encontrada' });
    }

    await maestria.destroy();
    res.json({ message: 'Maestría eliminada exitosamente' });
  } catch (error) {
    console.error('Error eliminando maestría:', error);
    res.status(500).json({ error: error.message });
  }
};