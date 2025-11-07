const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;
const authenticateToken = require('./middleware/auth.middleware');

// --- CẤU HÌNH CORS (SỬA LẠI) ---
// Danh sách các tên miền (origin) được phép
const allowedOrigins = [
  'https://curious-salmiakki-10e2f8.netlify.app'
  // Nếu bạn muốn test local, hãy thêm: 'http://localhost:3000'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Cho phép các request không có origin (ví dụ: Postman, app di động)
    if (!origin) return callback(null, true);
    
    // Nếu origin của request CÓ trong danh sách allowedOrigins
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Nếu không, từ chối
      callback(new Error('Bị chặn bởi CORS'), false);
    }
  }
};

// Sử dụng cấu hình CORS mới
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
  console.log(`Backend API đang chạy và lắng nghe trên cổng: ${port}`); 
});