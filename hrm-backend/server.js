const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const authenticateToken = require('./middleware/auth.middleware');

// --- (THÊM MỚI) IMPORT CONTROLLER TRỰC TIẾP ---
const authController = require('./controllers/auth.controller');
// ---

// --- CẤU HÌNH CORS THỦ CÔNG (MẠNH NHẤT) ---
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === 'OPTIONS') {
      return res.status(200).end();
  }
  next();
});
// --- HẾT PHẦN CẤU HÌNH ---

app.use(express.json());

// --- LOG KIỂM TRA (Để chắc chắn code mới đã lên) ---
console.log(">>> (v6) SERVER KHỞI ĐỘNG VỚI ROUTE LOGIN TRỰC TIẾP <<<");

// --- CÁC ROUTE ---

// --- (THAY ĐỔI) ĐỊNH NGHĨA LOGIN ROUTE TẠI ĐÂY ---
// const authRoutes = require('./routes/auth.routes'); // <-- Tắt file route
// app.use('/api/auth', authRoutes);
app.post('/api/auth/login', authController.login); // <-- Định nghĩa POST trực tiếp
// ---

app.use(authenticateToken); // Người gác cổng

// --- CÁC ROUTE CÒN LẠI ---
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

app.listen(port, () => {
  console.log(`Backend API (v6) đang chạy trên cổng: ${port}`);
});