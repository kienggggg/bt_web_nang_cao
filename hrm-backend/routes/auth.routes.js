const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// POST /api/auth/login
router.post('/login', authController.login);

// (Trong tương lai có thể thêm /register, /me tại đây)

module.exports = router;