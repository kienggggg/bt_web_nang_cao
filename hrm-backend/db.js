// hrm-backend/db.js
const mysql = require('mysql2/promise');
require('dotenv').config(); // Đảm bảo dòng này có để đọc biến môi trường nếu có

// Cấu hình kết nối
const dbConfig = {
  // SỬA LẠI Ở ĐÂY: Thay 'metro...' bằng 'switchback...' như chuỗi bạn gửi
  host: process.env.MYSQLHOST || 'switchback.proxy.rlwy.net', 
  
  user: process.env.MYSQLUSER || 'root',
  
  // Mật khẩu bạn gửi (Lưu ý: Khi đưa cho người khác xem code nên xóa đi nhé, ở đây mình để để bạn chạy được luôn)
  password: process.env.MYSQLPASSWORD || 'xxFUVnqKePUIvpXuzHlUmqhNmVnHOTTC', 
  
  database: process.env.MYSQLDATABASE || 'railway',
  
  // Port cũng phải khớp với chuỗi kết nối (50681)
  port: parseInt(process.env.MYSQLPORT || '50681', 10),

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  
  // Cấu hình SSL: Quan trọng khi kết nối từ Local lên Railway
  ssl: { rejectUnauthorized: false }
};

// Tạo pool kết nối
const pool = mysql.createPool(dbConfig);

// Kiểm tra kết nối ngay khi chạy server để biết lỗi sớm
pool.getConnection()
  .then(connection => {
    console.log(`✅ Đã kết nối MySQL thành công tới: ${dbConfig.host}`);
    connection.release();
  })
  .catch(err => {
    console.error('❌ LỖI KẾT NỐI MYSQL:', err.message);
    console.error('👉 Gợi ý: Kiểm tra lại Host, Port và Password trong db.js xem đã khớp với Railway chưa.');
  });

module.exports = pool;