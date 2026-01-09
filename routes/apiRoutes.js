const express = require('express');
const router = express.Router();
const washingMachineController = require('../controllers/washingMachineController');
const apiKeyAuth = require('../middleware/apiKeyAuth');

// ==================== ALL ROUTES REQUIRE API KEY ====================

// GET /api/v1/products - Lihat semua mesin cuci
router.get('/products', apiKeyAuth, washingMachineController.getAllWashingMachines);

// GET /api/v1/products/brands - Daftar merk
router.get('/products/brands', apiKeyAuth, washingMachineController.getAvailableBrands);

// GET /api/v1/products/types - Daftar tipe
router.get('/products/types', apiKeyAuth, washingMachineController.getAvailableTypes);

// GET /api/v1/products/stats - Statistik
router.get('/products/stats', apiKeyAuth, washingMachineController.getStatistics);

// GET /api/v1/products/model/:model - Detail by model
router.get('/products/model/:model', apiKeyAuth, washingMachineController.getWashingMachineByModel);

// GET /api/v1/products/:id - Detail by ID
router.get('/products/:id', apiKeyAuth, washingMachineController.getWashingMachineById);

module.exports = router;