const router = require('express').Router();
const controller = require('../controllers/noticiaController');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);

module.exports = router;