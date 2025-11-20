import React, { useState, useEffect } from 'react';
import { apiFetch, handleApiError } from '../services/apiHelper';

// --- Styles cho các "Thẻ Thống Kê" ---
const styles = {
  dashboardContainer: {
    display: 'grid',
    // Hiển thị 3 cột, tự động xuống hàng
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  statCard: {
    background: '#ffffff',
    padding: '20px 25px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    borderLeft: '5px solid #004aad'
  },
  statValue: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#004aad',
    margin: 0,
  },
  statTitle: {
    fontSize: '16px',
    color: '#555',
    margin: 0,
    marginTop: '5px',
  }
};

// Component "Thẻ" con
function StatCard({ value, title, icon }) {
  return (
    <div style={styles.statCard}>
      <p style={styles.statValue}>{icon} {value}</p>
      <p style={styles.statTitle}>{title}</p>
    </div>
  );
}


function DashboardPage() {
  // --- STATE ---
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- LOGIC API ---
  useEffect(() => {
    setLoading(true);
    setError(null);
    apiFetch('/api/dashboard/stats')
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
        // Tự động logout nếu token hết hạn
        handleApiError(err); 
      });
  }, []);// Chỉ chạy 1 lần khi tải trang

  // --- RENDER ---
  if (loading) {
    return <p>Đang tải dữ liệu tổng quan...</p>;
  }
  if (error) {
    return <p style={{ color: 'red' }}>Lỗi: {error}</p>;
  }
  if (!stats) {
    return <p>Không có dữ liệu.</p>;
  }

  return (
    <div>
      <h2>Trang Tổng quan</h2>
      <div style={styles.dashboardContainer}>
        {/* Hiển thị các thẻ thống kê */}
        <StatCard value={stats.totalEmployees} title="Tổng số nhân viên" icon="👥" />
        <StatCard value={stats.activeContracts} title="Hợp đồng đang hiệu lực" icon="📑" />
        <StatCard value={stats.absentToday} title="Vắng mặt hôm nay" icon="🗓️" />
        <StatCard value={stats.newCandidates} title="Ứng viên mới" icon="👨‍💼" />
        <StatCard value={stats.ongoingTrainings} title="Khóa đào tạo" icon="🎓" />
      </div>
    </div>
  );
}

export default DashboardPage;