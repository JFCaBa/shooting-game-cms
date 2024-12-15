const express = require('express');
const router = express.Router();
const rewardHistoryController = require('../controllers/rewardHistoryController');
const { rewardHistoryValidation } = require('../middleware/validators');

router.get('/', rewardHistoryValidation.getAll, rewardHistoryController.getAll);
router.get('/:id', rewardHistoryController.getOne);
router.post('/', rewardHistoryValidation.create, rewardHistoryController.create);
router.put('/:id', rewardHistoryValidation.update, rewardHistoryController.update);
router.delete('/:id', rewardHistoryController.delete);
router.get('/player/:playerId/stats', rewardHistoryController.getPlayerStats);

module.exports = router;