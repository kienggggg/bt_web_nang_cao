const jwt = require('jsonwebtoken');

// ! Lấy lại khóa bí mật
// Khóa này PHẢI GIỐNG HỆT khóa bạn dùng trong 'auth.controller.js'
const JWT_SECRET = 'day_la_khoa_bi_mat_cuc_ky_manh_va_dai_hon_123456789';

// Đây chính là "Người gác cổng"
const authenticateToken = (req, res, next) => {
  // 1. Lấy token từ header
  const authHeader = req.headers['authorization'];
  
  // Header sẽ có dạng "Bearer <TOKEN>"
  // Tách lấy phần token
  const token = authHeader && authHeader.split(' ')[1]; 

  // 2. Kiểm tra xem có token không
  if (token == null) {
    // 401 Unauthorized: Thiếu thông tin xác thực
    return res.status(401).json({ error: 'Yêu cầu thất bại. Không tìm thấy Token xác thực.' });
  }

  // 3. Xác thực token
  jwt.verify(token, JWT_SECRET, (err, userPayload) => {
    if (err) {
      // 403 Forbidden: Token không hợp lệ (hết hạn, sai...)
      console.log('Lỗi xác thực Token:', err.message);
      return res.status(403).json({ error: 'Token không hợp lệ hoặc đã hết hạn.' });
    }

    // 4. Nếu Token hợp lệ, gắn thông tin người dùng vào request
    // Các API (ví dụ: createEmployee) giờ có thể biết ai đang gọi
    req.user = userPayload; 
    
    // 5. Cho phép request đi tiếp
    next(); 
  });
};

module.exports = authenticateToken;