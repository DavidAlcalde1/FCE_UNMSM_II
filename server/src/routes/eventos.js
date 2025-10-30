const router = require('express').Router();
const controller = require('../controllers/eventoController');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);

module.exports = router;