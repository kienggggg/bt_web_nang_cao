import React, { useState, useEffect } from 'react';
import AttendanceForm from '../components/Attedance/AttendanceForm';
import AttendanceTable from '../components/Attedance/AttendanceTable';
import { apiFetch, handleApiError } from '../services/apiHelper';
import { exportToExcel } from '../services/excelHelper'; // <-- Import hàm vừa tạo

// State ban đầu cho form (copy từ AttendanceList)
const initialFormData = {
  id: null,
  employee_id: '',
  date: new Date().toISOString().split('T')[0], // Mặc định là ngày hôm nay
  status: 'Đi làm', // Mặc định
  notes: ''
};

// Styles cho Search (copy từ EmployeePage)
const styles = {
  input: { padding: '8px', border: '1px solid #ccc', borderRadius: '4px', flex: 1 },
  button: { padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white', marginRight: '5px' },
  btnPrimary: { backgroundColor: '#004aad' },
  btnSecondary: { backgroundColor: '#6c757d' },
  searchContainer: { marginBottom: '20px', display: 'flex', gap: '10px' }
};

function AttendancePage() {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const isAdmin = user.role === 'ADMIN';
  // --- STATE ---
  const [attendances, setAttendances] = useState([]);
  const [employees, setEmployees] = useState([]); // State cho dropdown
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [searchTerm, setSearchTerm] = useState('');

  const editingId = formData.id; // Lấy editingId từ formData

  // --- LOGIC API ---

  // Hàm fetch (READ) - (Đã đúng)
  const fetchAttendances = (currentSearchTerm) => {
    setLoading(true);
    setError(null);
    const encodedSearchTerm = encodeURIComponent(currentSearchTerm);
    
    apiFetch(`/api/attendance?search=${encodedSearchTerm}`)
      .then(data => { setAttendances(data); setLoading(false); })
      .catch(err => { setError(err.message); handleApiError(err); setLoading(false); });
  };

  // Hàm fetch Nhân viên (SỬA LẠI)
  const fetchEmployees = () => {
    apiFetch(`/api/employees?search=`) // <-- SỬA LẠI
      .then(data => setEmployees(data))
      .catch(err => {
          console.error("Lỗi API Nhân sự (dropdown):", err);
          setError(prev => prev ? `${prev}. ${err.message}` : err.message);
          handleApiError(err); // <-- THÊM VÀO
      });
  };

  useEffect(() => {
    fetchAttendances('');
    fetchEmployees();
  }, []);

  // Hàm SUBMIT (SỬA LẠI)
  const handleSubmit = (e) => {
    e.preventDefault();
    setApiError(null);
    const dataToSubmit = { ...formData, notes: formData.notes || '' };
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/attendance/${editingId}` : `/api/attendance`;

    apiFetch(url, { // <-- SỬA LẠI
      method: method,
      body: JSON.stringify(dataToSubmit),
    })
    .then(resultData => {
       if (editingId) {
           setAttendances(attendances.map(att => att.id === editingId ? resultData : att));
       } else {
           setAttendances([resultData, ...attendances]);
       }
       handleCancelEdit();
    })
    .catch(err => { // <-- SỬA LẠI
      console.error(`Lỗi khi ${editingId ? 'cập nhật' : 'thêm'} chấm công:`, err);
      setApiError(err.message);
      handleApiError(err); // <-- THÊM VÀO
    });
  };

  // Hàm XÓA (SỬA LẠI)
  const handleDelete = (attendanceId) => {
    if (!window.confirm('Bạn có chắc muốn xóa bản ghi chấm công này?')) return;
    setApiError(null);
    
    apiFetch(`/api/attendance/${attendanceId}`, { method: 'DELETE' }) // <-- SỬA LẠI
    .then(() => {
      setAttendances(attendances.filter(att => att.id !== attendanceId));
    })
    .catch(err => { // <-- SỬA LẠI
      console.error("Lỗi khi xóa chấm công:", err);
      setApiError(err.message);
      handleApiError(err); // <-- THÊM VÀO
    });
  };
  // --- HÀM XỬ LÝ SỰ KIỆN ---

  // Hàm khi nhấn "SỬA"
  const handleEditClick = (attendance) => {
    const formattedAttendance = {
        ...attendance,
        id: attendance.id, // Đảm bảo có id
        employee_id: attendance.employee_id ? String(attendance.employee_id) : '',
        date: attendance.date ? attendance.date.split('T')[0] : '',
        notes: attendance.notes || ''
    };
    setFormData(formattedAttendance);
    setApiError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Hàm khi nhấn "HỦY"
  const handleCancelEdit = () => {
    setFormData(initialFormData);
    setApiError(null);
  };
  
  // Xử lý TÌM KIẾM
  const handleSearchSubmit = (e) => { e.preventDefault(); fetchAttendances(searchTerm); };
  const handleClearSearch = () => { setSearchTerm(''); fetchAttendances(''); };
  // Hàm xử lý xuất Excel
  const handleExport = () => {
    if (attendances.length === 0) {
        alert("Không có dữ liệu để xuất!");
        return;
    }
    
    // Format dữ liệu cho đẹp trước khi xuất (Optional)
    exportToExcel(attendances, 'DS_ChamCong');

  };
  // --- RENDER ---
  return (
    <div>
      {isAdmin && (
      <AttendanceForm
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        handleCancelEdit={handleCancelEdit}
        employees={employees}
      />
      )}
      {apiError && <p style={{ color: 'red' }}>Lỗi Form: {apiError}</p>}

      {/* --- THANH TÌM KIẾM --- */}
      <h2>Danh sách Chấm công</h2>
      <div style={styles.searchContainer}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'contents' }}>
            <input 
              type="text" 
              placeholder="Tìm theo Tên NV, Mã NV, Trạng thái..." 
              style={styles.input} 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" style={{...styles.button, ...styles.btnPrimary}}>Tìm kiếm</button>
        </form>
        <button type="button" style={{ ...styles.button, ...styles.btnSecondary}} onClick={handleClearSearch}>Xóa tìm kiếm</button>
        <button 
            type="button" 
            style={{ ...styles.button, backgroundColor: '#28a745', marginLeft: 'auto' }} // Màu xanh lá, đẩy sang phải
            onClick={handleExport}
        >
            📊 Xuất Excel
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {loading ? (
          <p>Đang tải dữ liệu...</p>
      ) : (
          <AttendanceTable
            attendances={attendances}
            handleEditClick={handleEditClick}
            handleDelete={handleDelete}
          />
      )}
    </div>
  );
}

export default AttendancePage;