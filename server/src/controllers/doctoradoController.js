// server/src/controllers/doctoradoController.js
const Doctorado = require('../models/Doctorado');

exports.getAll = async (req, res) => {
  try {
    const oficina = req.query.oficina || "fce"; // FILTRO OFICINA
    
    const doctorados = await Doctorado.findAll({
      where: { oficina: oficina } // AGREGADO: filtro oficina
    });
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

// ========= FUNCIONES CRUD ADMIN =========

// Crear doctorado (solo admin)
exports.create = async (req, res) => {
  try {
    const { oficina = "fce", ...datos } = req.body; // AGREGADO: oficina por defecto
    const nuevoDoctorado = await Doctorado.create({
      oficina,
      ...datos
    });
    res.status(201).json(nuevoDoctorado);
  } catch (error) {
    console.error('Error creando doctorado:', error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar doctorado (solo admin)
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { oficina, ...datos } = req.body;
    
    const doctorado = await Doctorado.findByPk(id);
    if (!doctorado) {
      return res.status(404).json({ error: 'Doctorado no encontrado' });
    }

    await doctorado.update({
      ...(oficina && { oficina }),
      ...datos
    });

    res.json(doctorado);
  } catch (error) {
    console.error('Error actualizando doctorado:', error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar doctorado (solo admin)
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const doctorado = await Doctorado.findByPk(id);
    
    if (!doctorado) {
      return res.status(404).json({ error: 'Doctorado no encontrado' });
    }

    await doctorado.destroy();
    res.json({ message: 'Doctorado eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando doctorado:', error);
    res.status(500).json({ error: error.message });
  }
};