const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;
const authenticateToken = require('./middleware/auth.middleware');

// --- CẤU HÌNH CORS (SỬA LẠI LẦN 2) ---
// Cấu hình rõ ràng hơn để xử lý preflight
const corsOptions = {
  // Chỉ cho phép origin này
  origin: 'https://curious-salmiakki-10e2f8.netlify.app', 
  // Các phương thức được phép
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  // Các header được phép
  allowedHeaders: ['Content-Type', 'Authorization'] 
};

// 1. Kích hoạt CORS cho TẤT CẢ các route
app.use(cors(corsOptions));

// 2. (Quan trọng) Tự động trả lời OK cho TẤT CẢ các request OPTIONS (preflight)
// Điều này phải được đặt TRƯỚC TẤT CẢ các route khác
app.options('*', cors(corsOptions)); 
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
  console.log(`Backend API đang chạy và lắng nghe trên cổng: ${port}`); 
});