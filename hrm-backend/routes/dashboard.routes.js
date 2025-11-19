// hrm-backend/routes/dashboard.routes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const authenticateToken = require('../middleware/auth.middleware');
router.use(authenticateToken);
// GET /api/dashboard/stats
router.get('/stats', dashboardController.getDashboardStats);

module.exports = router;