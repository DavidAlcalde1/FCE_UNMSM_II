// server/src/routes/contacto.js
const express = require('express');
const router = express.Router();
const Contacto = require('../models/Contacto');
const { enviarCorreo } = require('../utils/email');

router.post('/', async (req, res) => {
  try {
    const { oficina, nombre, email, telefono, mensaje } = req.body;
    const oficinasValidas = ['fce', 'ocaa', 'posgrado', 'cerseu', 'cesepi'];
    
    if (!oficinasValidas.includes(oficina)) {
      return res.status(400).json({ error: 'Oficina no válida' });
    }

    await Contacto.create(req.body);
    // await enviarCorreo(oficina, req.body); // 

    res.json({ success: true });
  } catch (error) {
    console.error('Error al guardar contacto:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

module.exports = router;