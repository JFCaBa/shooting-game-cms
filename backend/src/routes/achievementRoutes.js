const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController');
const { achievementValidation } = require('../middleware/validators');

router.get('/', achievementController.getAll);
router.get('/:id', achievementController.getOne);
router.post('/', achievementValidation.create, achievementController.create);
router.put('/:id', achievementValidation.update, achievementController.update);
router.delete('/:id', achievementController.delete);
router.get('/player/:playerId', achievementController.getPlayerAchievements);

module.exports = router;