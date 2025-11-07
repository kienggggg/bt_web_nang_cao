const express = require('express');
const cors = require('cors');
const app = express();

// --- 1. SỬ DỤNG PORT CỦA RAILWAY ---
const port = process.env.PORT || 3001; 
// ---
const authenticateToken = require('./middleware/auth.middleware');

// --- 2. SỬ DỤNG CORS ĐƠN GIẢN NHẤT ---
// Cho phép tất cả mọi người
app.use(cors()); 
// ---

app.use(express.json());

// --- CÁC ROUTE CÔNG KHAI (Public) ---
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes); // API Đăng nhập

// Bất kỳ API nào bên dưới dòng này đều BẮT BUỘC phải có Token
app.use(authenticateToken);

// --- CÁC ROUTE BẢO MẬT (Private) ---
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
  console.log(`Backend API đang chạy và lắng nghe trên cổng: ${port}`); 
});