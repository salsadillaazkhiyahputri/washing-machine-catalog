const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const washingMachineController = require('../controllers/washingMachineController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/admin/login - Login admin (public)
router.post('/login', adminController.login);

// ==================== PROTECTED ROUTES ====================

// Dashboard
router.get('/stats', authMiddleware, adminController.getStats);

// Clients Management
router.get('/clients', authMiddleware, adminController.getAllClients);

// API Keys Management
router.get('/api-keys', authMiddleware, adminController.getAllApiKeys);
router.patch('/api-keys/:id/toggle', authMiddleware, adminController.toggleApiKeyStatus);
router.delete('/api-keys/:id', authMiddleware, adminController.deleteApiKey);

// API Logs
router.get('/logs', authMiddleware, adminController.getApiLogs);

// Products Management
router.get('/products', authMiddleware, washingMachineController.getAllWashingMachinesAdmin);
router.post('/products', authMiddleware, washingMachineController.createWashingMachine);
router.put('/products/:id', authMiddleware, washingMachineController.updateWashingMachine);
router.delete('/products/:id', authMiddleware, washingMachineController.deleteWashingMachine);

module.exports = router;