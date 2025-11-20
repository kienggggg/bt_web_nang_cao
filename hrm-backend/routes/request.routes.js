const express = require('express');
const router = express.Router();
const requestController = require('../controllers/request.controller');
const authenticateToken = require('../middleware/auth.middleware');

// Tất cả API này đều cần đăng nhập
router.use(authenticateToken);

// Gửi yêu cầu (Nhân viên)
router.post('/', requestController.createRequest);

// Xem danh sách (Admin - Sau này thêm middleware checkRole vào đây)
router.get('/', requestController.getAllRequests);

// Duyệt/Từ chối (Admin)
router.put('/:id/process', requestController.processRequest);

module.exports = router;