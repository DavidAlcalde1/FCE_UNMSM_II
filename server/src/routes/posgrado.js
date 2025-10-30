const router = require('express').Router();
const maestriaController = require('../controllers/maestriaController');
const doctoradoController = require('../controllers/doctoradoController');

// Maestrías
router.get('/maestrias', maestriaController.getAll);
router.get('/maestrias/:id', maestriaController.getById);

// Doctorados  
router.get('/doctorados', doctoradoController.getAll);
router.get('/doctorados/:id', doctoradoController.getById);

module.exports = router;