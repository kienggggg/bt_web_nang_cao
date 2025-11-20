const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authenticateToken = require('../middleware/auth.middleware');
// POST /api/auth/signin (Đăng nhập)
router.post('/signin', authController.login);
// Giữ lại cái này nếu code cũ còn dùng
router.post('/login', authController.login); 

// 👇 QUAN TRỌNG: Đây là cái "Cửa" bạn đang thiếu
// POST /api/auth/change-password
router.post('/change-password', authenticateToken, authController.changePassword);

module.exports = router;