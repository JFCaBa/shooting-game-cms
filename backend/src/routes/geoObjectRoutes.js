const express = require('express');
const router = express.Router();
const geoObjectController = require('../controllers/geoObjectController');
const { geoObjectValidation } = require('../middleware/validators');

router.get('/', geoObjectController.getAll);
router.get('/:id', geoObjectController.getOne);
router.put('/:id', geoObjectValidation.update, geoObjectController.update);
router.delete('/:id', geoObjectController.delete);

router.post('/', geoObjectValidation.create, geoObjectController.create);
router.post('/assign', geoObjectValidation.assign, geoObjectController.assign);

module.exports = router;