const generationConfigController = require('../controllers/generationConfigController');
const express = require('express');
const router = express.Router();

// Routes for generation configurations

router.post('/', generationConfigController.createGenerationConfig);
router.get('/', generationConfigController.getAllConfigs);
router.get('/:id', generationConfigController.getConfigById);
router.put('/:id', generationConfigController.updateConfig);

module.exports = router;