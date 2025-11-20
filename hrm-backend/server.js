// hrm-backend/server.js
const express = require('express');
const cors = require('cors'); // Import 1 lần duy nhất ở đây
require('dotenv').config();

// Khởi tạo app
const app = express();

// --- CẤU HÌNH PORT ---
const port = process.env.PORT || 3001;

// --- CẤU HÌNH CORS (Quan trọng cho Vercel) ---
app.use(cors({
    origin: '*', // Cho phép tất cả truy cập
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

const fs = require('fs');
const path = require('path');
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Mở quyền truy cập tĩnh (Static) cho thư mục uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Xử lý Preflight Request
app.options('*', cors());

// Cho phép đọc JSON
app.use(express.json());


// --- LOGGING ---
console.log(">>> (vFinal 2.0) SERVER ĐANG KHỞI ĐỘNG... <<<");

// --- MIDDLEWARE ---
const authenticateToken = require('./middleware/auth.middleware');
const authController = require('./controllers/auth.controller');

// --- IMPORT ROUTES ---
const authRoutes = require('./routes/auth.routes'); 
const employeeRoutes = require('./routes/employee.routes');
const contractRoutes = require('./routes/contract.routes');
const trainingRoutes = require('./routes/training.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const candidateRoutes = require('./routes/candidate.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const requestRoutes = require('./routes/request.routes');
// --- PUBLIC ROUTES (Không cần Token) ---
// Kích hoạt routes Auth (bao gồm /signin và /change-password)
app.use('/api/auth', authRoutes);

// --- PROTECTED ROUTES (Bắt buộc có Token) ---
// Cánh cổng bảo vệ: Những route bên dưới dòng này phải có Token mới vào được
app.use(authenticateToken);

app.use('/api/employees', employeeRoutes);
app.use('/api/contract', contractRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/candidate', candidateRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/requests', requestRoutes);
// --- KHỞI CHẠY SERVER ---
app.listen(port, () => {
  console.log(`🚀 Backend API đang chạy trên cổng: ${port}`);
});