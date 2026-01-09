const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

// POST /api/client/register - Register & Generate API Key
router.post('/register', clientController.generateApiKey);

// POST /api/client/verify - Verify API Key
router.post('/verify', clientController.verifyApiKey);

module.exports = router;