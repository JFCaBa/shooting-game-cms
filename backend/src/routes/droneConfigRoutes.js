const express = require('express');
const router = express.Router();
const droneConfigController = require('../controllers/droneConfigController');

router.get('/', droneConfigController.getConfig);
router.put('/', droneConfigController.updateConfig);

module.exports = router;