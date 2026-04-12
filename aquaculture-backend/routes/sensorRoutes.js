const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');

router.post('/generate', sensorController.generateData);
router.get('/history/:user_id', sensorController.getHistory);

// ADD THIS
router.get('/live', sensorController.getLiveData);

module.exports = router;