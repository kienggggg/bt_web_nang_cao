const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const authenticateToken = require('./middleware/auth.middleware');
const authController = require('./controllers/auth.controller');

// --- CẤU HÌNH CORS THỦ CÔNG (Giữ nguyên) ---
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === 'OPTIONS') {
      return res.status(200).end();
  }
  next();
});
// ---

app.use(express.json());

// --- LOG KIỂM TRA (v7) ---
console.log(">>> (v7) SERVER KHỞI ĐỘNG VỚI ROUTE /SIGNIN <<<");

// --- CÁC ROUTE ---

// --- (THAY ĐỔI) ĐỔI TÊN API ĐĂNG NHẬP ---
// const authRoutes = require('./routes/auth.routes'); 
// app.use('/api/auth', authRoutes);
app.post('/api/auth/signin', authController.login); // <-- ĐỔI THÀNH /signin
// ---

app.use(authenticateToken); // Người gác cổng

// ... (Các route còn lại giữ nguyên) ...
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
  console.log(`Backend API (v7) đang chạy trên cổng: ${port}`);
});