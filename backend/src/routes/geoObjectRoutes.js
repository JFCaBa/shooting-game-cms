const express = require('express');
const router = express.Router();
const geoObjectController = require('../controllers/geoObjectController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);
router.post('/assign', geoObjectController.assign);
router.post('/', geoObjectController.create);
router.get('/', geoObjectController.getAll);
router.get('/:id', geoObjectController.getOne);
router.put('/:id', geoObjectController.update);
router.delete('/:id', geoObjectController.delete);

module.exports = router;