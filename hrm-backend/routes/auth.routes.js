const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authenticateToken = require('../middleware/auth.middleware');
// POST /api/auth/login
router.post('/login', authController.login);
router.post('/signin', authController.login);
// POST /api/auth/change-password (Cần đăng nhập)
router.post('/change-password', authenticateToken, authController.changePassword);

module.exports = router;