const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidate.controller');
const authenticateToken = require('../middleware/auth.middleware');
const multer = require('multer');
const path = require('path');

// --- CẤU HÌNH MULTER (Nơi lưu file) ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Lưu vào thư mục 'uploads'
  },
  filename: function (req, file, cb) {
    // Đặt tên file: timestamp-tenfilegoc
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// --- ROUTES ---
// 1. Lấy danh sách (Ai cũng xem được hoặc cần login tùy bạn - ở đây mình để cần login)
router.get('/', authenticateToken, candidateController.getAllCandidates);

// 2. Thêm ứng viên (Kèm file CV) - QUAN TRỌNG: upload.single('cv')
// 'cv' là tên field trong FormData ở Frontend gửi lên
router.post('/', authenticateToken, upload.single('cv'), candidateController.createCandidate);

// 3. Cập nhật (Có thể cập nhật file hoặc không)
router.put('/:id', authenticateToken, upload.single('cv'), candidateController.updateCandidate);

// 4. Xóa
router.delete('/:id', authenticateToken, candidateController.deleteCandidate);

module.exports = router;