const express = require('express');
// const cors = require('cors'); // <-- KHÔNG DÙNG THƯ VIỆN NỮA
const app = express();
const port = process.env.PORT || 3001;
const authenticateToken = require('./middleware/auth.middleware');

// --- CẤU HÌNH CORS THỦ CÔNG (MẠNH NHẤT) ---
app.use((req, res, next) => {
  // 1. Cho phép tất cả các tên miền
  res.header("Access-Control-Allow-Origin", "*");
  // 2. Cho phép các phương thức
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  // 3. Cho phép các headers quan trọng (đặc biệt là Authorization để gửi Token)
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
  // 4. Xử lý ngay lập tức yêu cầu "kiểm tra" (Preflight OPTIONS)
  if (req.method === 'OPTIONS') {
      return res.status(200).end();
  }
  
  next(); // Cho phép đi tiếp đến các API khác
});
// --- HẾT PHẦN CẤU HÌNH ---

app.use(express.json());

// --- LOG KIỂM TRA (Để chắc chắn code mới đã lên) ---
console.log(">>> SERVER ĐANG KHỞI ĐỘNG VỚI CẤU HÌNH MANUAL CORS <<<");

// --- CÁC ROUTE ---
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

app.use(authenticateToken); // Người gác cổng

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
  console.log(`(v5) Backend API đang chạy trên cổng: ${port}`); 
});