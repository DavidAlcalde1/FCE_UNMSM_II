const router = require('express').Router();
const controller = require('../controllers/egresadoController');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);

module.exports = router;