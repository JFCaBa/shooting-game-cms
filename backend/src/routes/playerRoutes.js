const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');
const { playerValidation } = require('../middleware/validators');

router.get('/', playerValidation.getAll, playerController.getAll);
router.get('/:id', playerController.getOne);
router.post('/', playerValidation.create, playerController.create);
router.put('/:id', playerValidation.update, playerController.update);
router.delete('/:id', playerController.delete);

router.delete('/cleanup/empty-ids', playerController.deleteEmptyIds);

module.exports = router;