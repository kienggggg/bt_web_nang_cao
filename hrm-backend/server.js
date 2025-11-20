console.log(">>> Server HRM v2 - Updated Change Password Route");
const express = require('express');
const cors = require('cors'); // Import thư viện CORS
require('dotenv').config(); // Import biến môi trường

// --- CẤU HÌNH PORT ---
// Railway sẽ tự động cung cấp PORT, nếu chạy local thì dùng 3001
const port = process.env.PORT || 3001;

// --- MIDDLEWARE ---
const authenticateToken = require('./middleware/auth.middleware');
const authController = require('./controllers/auth.controller');
const app = express();

// --- CẤU HÌNH CORS (Cho phép Vercel truy cập) ---
app.use(cors({
    origin: '*', // Cho phép tất cả các domain truy cập (Dùng cho dự án học tập)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // Các method cho phép
    allowedHeaders: ['Content-Type', 'Authorization'], // Các header cho phép
    credentials: true // Cho phép gửi cookie/token nếu cần
}));

// Xử lý Preflight Request (Quan trọng cho các trình duyệt khó tính)
app.options('*', cors());
// 2. Cho phép đọc JSON từ body request
app.use(express.json());

// --- LOGGING ---
console.log(">>> (vFinal) SERVER ĐANG KHỞI ĐỘNG... <<<");

const authRoutes = require('./routes/auth.routes'); 

// 2. Kích hoạt routes (Dòng này sẽ nạp cả /signin và /change-password)
app.use('/api/auth', authRoutes);


// --- PROTECTED ROUTES (Bắt buộc phải có Token) ---
// "Cánh cổng bảo vệ" nằm ở đây. Mọi route bên dưới dòng này đều bị chặn nếu không có Token.
app.use(authenticateToken);

// Import các routes con
const employeeRoutes = require('./routes/employee.routes');
const contractRoutes = require('./routes/contract.routes');
const trainingRoutes = require('./routes/training.routes');
const attendanceRoutes = require('./routes/attendance.routes');;
const candidateRoutes = require('./routes/candidate.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

// Đăng ký routes
app.use('/api/employees', employeeRoutes);
app.use('/api/contract', contractRoutes); // Lưu ý: Frontend gọi là /contract hay /contracts?
app.use('/api/training', trainingRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/candidate', candidateRoutes);
app.use('/api/dashboard', dashboardRoutes);

// --- KHỞI CHẠY SERVER ---
app.listen(port, () => {
  console.log(`🚀 Backend API đang chạy trên cổng: ${port}`);
});