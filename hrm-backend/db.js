// hrm-backend/db.js
const mysql = require('mysql2/promise'); // Dùng "promise" để có thể dùng async/await

// Tạo một "pool" kết nối (quản lý nhiều kết nối cùng lúc, hiệu quả hơn)
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // User XAMPP của bạn
  password: '',   // Pass XAMPP của bạn
  database: 'hrm_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log("Đã tạo kết nối CSDL (Connection Pool)...");

module.exports = pool; // Xuất ra để file khác dùng