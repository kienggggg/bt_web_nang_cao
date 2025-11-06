// hrm-backend/server.js
const express = require('express');
const cors = require('cors');
//const db = require('./db');

const app = express();
const port = 3001;
const authenticateToken = require('./middleware/auth.middleware');
app.use(cors());
app.use(express.json());
// --- CÁC ROUTE CÔNG KHAI (Public) ---
// API Đăng nhập KHÔNG cần bảo vệ
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

// Bất kỳ API nào bên dưới dòng này đều BẮT BUỘC phải có Token
app.use(authenticateToken);
// --- API NHÂN SỰ (Giữ nguyên) ---
const employeeRoutes = require('./routes/employee.routes');
app.use('/api/employees', employeeRoutes);

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
  // Log ra cổng thực tế đang sử dụng
  console.log(`Backend API đang chạy và lắng nghe trên cổng: ${port}`); 
});