const express = require('express');
const router = express.Router();
const tokenBalanceController = require('../controllers/tokenBalanceController');
const { tokenBalanceValidation } = require('../middleware/validators');

router.get('/', tokenBalanceController.getAll);
router.get('/:id', tokenBalanceController.getOne);
router.post('/', tokenBalanceValidation.create, tokenBalanceController.create);
router.put('/:id', tokenBalanceValidation.update, tokenBalanceController.update);
router.delete('/:id', tokenBalanceController.delete);

module.exports = router;
