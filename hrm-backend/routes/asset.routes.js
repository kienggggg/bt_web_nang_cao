// hrm-backend/routes/asset.routes.js
const express = require('express');
const router = express.Router();
const assetController = require('../controllers/asset.controller');

// Định nghĩa các routes cho tài sản
// /api/asset/
router.get('/', assetController.getAllAssets);
router.post('/', assetController.createAsset);

// /api/asset/:id
router.put('/:id', assetController.updateAsset);
router.delete('/:id', assetController.deleteAsset);

module.exports = router;