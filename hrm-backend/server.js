const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;
const authenticateToken = require('./middleware/auth.middleware');

// --- CẤU HÌNH CORS (SỬA LẠI LẦN 4 - "Kitchen Sink") ---

// 1. Cấu hình "mở toang"
const corsOptions = {
  origin: '*', // Cho phép TẤT CẢ
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// 2. (Quan trọng) Tự động trả lời OK cho TẤT CẢ các request OPTIONS (preflight)
// Phải đặt TRƯỚC TẤT CẢ các route khác
app.options('*', cors(corsOptions)); 

// 3. Sử dụng CORS cho tất cả các route khác
app.use(cors(corsOptions)); 
// --- HẾT PHẦN CẤU HÌNH CORS ---


app.use(express.json());

// --- CÁC ROUTE CÔNG KHAI (Public) ---
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

// Bất kỳ API nào bên dưới dòng này đều BẮT BUỘC phải có Token
app.use(authenticateToken);

// --- API NHÂN SỰ ---
const employeeRoutes = require('./routes/employee.routes');
app.use('/api/employees', employeeRoutes);

// ... (tất cả các app.use khác của bạn) ...
const contractRoutes = require('./routes/contract.routes');
app.use('/api/contract', contractRoutes);

const trainingRoutes = require('./routes/training.routes');
app.use('/api/training', trainingRoutes);

const attendanceRoutes = require('./routes/attendance.routes');
app.use('/api/attendance', attendanceRoutes);

const assetRoutes = require('./routes/asset.routes');
app.use('/api/asset', assetRoutes);

const candidateRoutes = require('./routes/candidate.routes');
app.use('/api/candidate', candidateRoutes);

const dashboardRoutes = require('./routes/dashboard.routes');
app.use('/api/dashboard', dashboardRoutes);

// --- Khởi động máy chủ ---
app.listen(port, () => {
  console.log(`(v4) Backend API đang chạy và lắng nghe trên cổng: ${port}`); 
});