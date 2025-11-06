import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Import 4 component Bảng (Table)
import ContractTable from '../components/ContractTable';
import AssetTable from '../components/AssetTable';
import TrainingTable from '../components/TrainingTable';
import AttendanceTable from '../components/AttendanceTable';
import { apiFetch, handleApiError } from '../services/apiHelper';
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// --- Styles (Giữ nguyên) ---
const styles = {
  container: {
    background: '#ffffff',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  header: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#004aad',
    borderBottom: '2px solid #f4f6f9',
    paddingBottom: '10px',
    marginBottom: '20px',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '150px 1fr',
    gap: '15px',
  },
  infoLabel: { fontWeight: '600', color: '#555' },
  infoValue: { color: '#333' },
  backLink: {
    display: 'inline-block',
    marginTop: '25px',
    textDecoration: 'none',
    color: '#004aad',
    fontWeight: '600',
  },
  subHeader: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#004aad',
    borderTop: '2px solid #f4f6f9',
    paddingTop: '20px',
    marginTop: '30px',
  }
};

// --- Component Loading/Error ---
const Loading = () => <p>Đang tải...</p>;
const Error = ({ message }) => <p style={{ color: 'red' }}>Lỗi: {message}</p>;


function EmployeeDetailPage() {
  // --- STATE (Mở rộng) ---
  const [employee, setEmployee] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [assets, setAssets] = useState([]);
  const [trainings, setTrainings] = useState([]); // <-- THÊM MỚI
  const [attendances, setAttendances] = useState([]); // <-- THÊM MỚI
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();

  // --- LOGIC API (CẬP NHẬT) ---
  useEffect(() => {
    setLoading(true);
    setError(null);
    setEmployee(null);
    setContracts([]);
    setAssets([]);
    setTrainings([]);
    setAttendances([]);

    // Tạo 5 yêu cầu API (dùng apiFetch)
    const fetchEmployee = apiFetch(`${apiUrl}/api/employees/${id}`);
    const fetchContracts = apiFetch(`${apiUrl}/api/employees/${id}/contracts`);
    const fetchAssets = apiFetch(`${apiUrl}/api/employees/${id}/assets`);
    const fetchTrainings = apiFetch(`${apiUrl}/api/employees/${id}/training`);
    const fetchAttendances = apiFetch(`${apiUrl}/api/employees/${id}/attendance`);

    // Chạy song song cả 5
    Promise.all([
      fetchEmployee, 
      fetchContracts, 
      fetchAssets, 
      fetchTrainings,
      fetchAttendances
    ])
    .then(([
      employeeData, 
      contractsData, 
      assetsData, 
      trainingsData,
      attendancesData
    ]) => {
        // apiFetch đã xử lý lỗi .ok và .json()
        setEmployee(employeeData);
        setContracts(contractsData);
        setAssets(assetsData);
        setTrainings(trainingsData);
        setAttendances(attendancesData);
    })
    .catch(err => {
      console.error("Lỗi khi tải chi tiết nhân viên:", err);
      setError(err.message);
      handleApiError(err); // Xử lý lỗi (ví dụ: logout)
    })
    .finally(() => {
      setLoading(false);
    });
      
  }, [id]); // Chạy lại nếu ID thay đổi

  // --- RENDER ---
  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!employee) return <p>Không tìm thấy nhân viên.</p>;

  // Hàm rỗng để vô hiệu hóa nút
  const noOp = () => {}; 

  return (
    <div>
      {/* THÔNG TIN CƠ BẢN (Giữ nguyên) */}
      <div style={styles.container}>
        <h2 style={styles.header}>Hồ sơ nhân viên: {employee.full_name}</h2>
        <div style={styles.infoGrid}>
          {/* ... (các trường thông tin) ... */}
          <span style={styles.infoLabel}>Mã nhân viên:</span>
          <span style={styles.infoValue}>{employee.employee_code}</span>
          <span style={styles.infoLabel}>Phòng ban:</span>
          <span style={styles.infoValue}>{employee.department || '-'}</span>
          <span style={styles.infoLabel}>Chức vụ:</span>
          <span style={styles.infoValue}>{employee.position || '-'}</span>
          <span style={styles.infoLabel}>Email:</span>
          <span style={styles.infoValue}>{employee.email || '-'}</span>
          <span style={styles.infoLabel}>Số điện thoại:</span>
          <span style={styles.infoValue}>{employee.phone || '-'}</span>
        </div>
        <Link to="/employees" style={styles.backLink}>
          &larr; Quay lại danh sách
        </Link>
      </div>

      {/* --- PHẦN HỢP ĐỒNG (Giữ nguyên) --- */}
      <div style={{...styles.container, marginTop: '20px'}}>
        <h3 style={styles.subHeader}>Hợp đồng Liên quan</h3>
        <ContractTable
          contracts={contracts}
          handleEditClick={noOp}
          handleDelete={noOp}
        />
        {contracts.length === 0 && <p>Nhân viên này chưa có hợp đồng nào.</p>}
      </div>

      {/* --- PHẦN TÀI SẢN (Giữ nguyên) --- */}
      <div style={{...styles.container, marginTop: '20px'}}>
        <h3 style={styles.subHeader}>Tài sản đang giữ</h3>
        <AssetTable
          assets={assets}
          handleEditClick={noOp}
          handleDelete={noOp}
        />
        {assets.length === 0 && <p>Nhân viên này không giữ tài sản nào.</p>}
      </div>

      {/* --- PHẦN ĐÀO TẠO (THÊM MỚI) --- */}
      <div style={{...styles.container, marginTop: '20px'}}>
        <h3 style={styles.subHeader}>Lịch sử Đào tạo</h3>
        <TrainingTable
          trainings={trainings}
          handleEditClick={noOp}
          handleDelete={noOp}
        />
        {trainings.length === 0 && <p>Nhân viên này chưa tham gia khóa đào tạo nào.</p>}
      </div>
      
      {/* --- PHẦN CHẤM CÔNG (THÊM MỚI) --- */}
      <div style={{...styles.container, marginTop: '20px'}}>
        <h3 style={styles.subHeader}>Lịch sử Chấm công (100 ngày gần nhất)</h3>
        <AttendanceTable
          attendances={attendances}
          handleEditClick={noOp}
          handleDelete={noOp}
        />
        {attendances.length === 0 && <p>Không có dữ liệu chấm công.</p>}
      </div>

    </div>
  );
}

export default EmployeeDetailPage;