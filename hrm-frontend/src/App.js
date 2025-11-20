import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
// Import "Người gác cổng"
import ProtectedRoute from './components/ProtectedRoute';
// Import các component
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EmployeePage from './pages/EmployeePage';
import EmployeeDetailPage from './pages/EmployeeDetailPage';
import ContractPage from './pages/ContractPage';
import TrainingPage from './pages/TrainingPage';
import AttendancePage from './pages/AttendancePage';
import CandidatePage from './pages/CandidatePage';

// CSS
const styles = {
  page: { fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif" },
  appContainer: { display: 'flex' },
  sidebar: {
    width: '220px',
    background: '#004aad',
    color: 'white',
    height: '100vh',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column'
  },
  sidebarTitle: {
      fontSize: '20px',
      textAlign: 'center',
      marginBottom: '20px',
      fontWeight: 'bold',
      color: '#ffcc00'
  },
  navContainer: {
      flexGrow: 1,
      overflowY: 'auto'
  },
  sidebarLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: 'white',
    padding: '12px 15px',
    textDecoration: 'none',
    borderRadius: '6px',
    marginBottom: '8px',
    transition: 'background-color 0.2s'
  },
  sidebarLinkActive: {
      backgroundColor: '#003580',
      fontWeight: 'bold'
  },
  mainContent: {
    flex: 1,
    padding: '20px',
    backgroundColor: '#f4f6f9',
    height: '100vh',
    overflowY: 'auto'
  },
  logoutButton: {
    marginTop: '20px',         // Cách các link bên trên ra
    padding: '10px 15px',
    background: 'rgba(255, 255, 255, 0.1)', // Nền mờ nhẹ
    color: '#ff6b6b',          // Màu đỏ nhạt cho nổi bật (cảnh báo đăng xuất)
    border: '1px solid #ff6b6b',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: 'bold',
    width: '100%',             // Rộng full sidebar
    textAlign: 'center',
    transition: 'all 0.3s ease'
  }
};

// Hàm helper để gộp style
const getLinkStyle = ({ isActive }) => ({
  ...styles.sidebarLink,
  ...(isActive ? styles.sidebarLinkActive : {})
});


function MainLayout() {
  
  const handleLogout = () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login'; // Tải lại trang và về trang login
    }
  };
  const user = JSON.parse(localStorage.getItem('user'));
  return (
    <div style={styles.appContainer}>
      {/* --- SIDEBAR --- */}
      <nav style={styles.sidebar}>
          <div style={styles.sidebarTitle}>HRM System</div>
          <div style={styles.navContainer}>
            {/* Các link điều hướng */}
            <NavLink to="/" style={getLinkStyle} end> 📊 Tổng quan </NavLink>
            {user && user.role === 'ADMIN' && (
              <NavLink to="/employees" style={getLinkStyle}> 👥 Nhân sự </NavLink>
            )}
            <NavLink to="/contracts" style={getLinkStyle}> 📑 Hợp đồng </NavLink>
            <NavLink to="/training" style={getLinkStyle}> 🎓 Đào tạo </NavLink>
            <NavLink to="/attendance" style={getLinkStyle}> 🗓️ Chấm công </NavLink>
            <NavLink to="/candidates" style={getLinkStyle}> 👨‍💼 Tuyển dụng </NavLink>
          </div>
          
          {/* Nút Đăng xuất */}
          <button 
             style={styles.logoutButton} 
             onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#003580'}
             onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
             onClick={handleLogout}>
            🚪 Đăng xuất
          </button>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main style={styles.mainContent}>
        {/* Các Route "con" sẽ được render ở đây */}
        <Routes>
          <Route path="/employees/:id" element={<EmployeeDetailPage />} />
          <Route path="/employees" element={<EmployeePage />} />
          <Route path="/contracts" element={<ContractPage />} />
          <Route path="/training" element={<TrainingPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/candidates" element={<CandidatePage />} />
          <Route path="/" element={<DashboardPage />} /> 
          <Route path="*" element={<h2>Trang không tồn tại</h2>} />
        </Routes>
      </main>
    </div>
  );
}

// --- Component App chính (Giờ chỉ lo Định tuyến) ---
function App() {
  return (
    <div style={styles.page}>
      <BrowserRouter>
        <Routes>
          {/* Route 1: Trang Login (Public) */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Route 2: Tất cả các trang khác (Private) */}
          {/* Gói tất cả trong ProtectedRoute */}
          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
                <MainLayout /> 
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;