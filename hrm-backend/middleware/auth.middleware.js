// hrm-backend/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Đảm bảo đọc được biến môi trường

// SỬA Ở ĐÂY: Phải dùng chung nguồn với auth.controller.js
const JWT_SECRET = process.env.JWT_SECRET || 'chuoi_bi_mat_du_phong_cho_local';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // Token thường có dạng: "Bearer eyJhbGciOi..."
  const token = authHeader && authHeader.split(' ')[1]; 

  if (token == null) {
    return res.status(401).json({ error: 'Bạn chưa đăng nhập (Thiếu Token).' });
  }

  jwt.verify(token, JWT_SECRET, (err, userPayload) => {
    if (err) {
      console.log('❌ Lỗi xác thực Token:', err.message);
      return res.status(403).json({ error: 'Phiên đăng nhập đã hết hạn hoặc không hợp lệ.' });
    }

    req.user = userPayload; 
    next(); 
  });
};

module.exports = authenticateToken;