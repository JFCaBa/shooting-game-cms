const express = require('express');
const router = express.Router();
const droneController = require('../controllers/droneController');
const { droneValidation } = require('../middleware/validators');

router.get('/', droneController.getAll);
router.get('/:id', droneController.getOne);
router.post('/', droneValidation.create, droneController.create);
router.put('/:id', droneValidation.update, droneController.update);
router.delete('/:id', droneController.delete);

module.exports = router;