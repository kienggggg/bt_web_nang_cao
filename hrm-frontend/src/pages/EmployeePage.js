import React, { useState, useEffect } from 'react';
// Import 2 component con
import EmployeeForm from '../components/Employees/EmployeeForm';
import EmployeeTable from '../components/Employees/EmployeeTable';
import { apiFetch, handleApiError } from '../services/apiHelper';
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// State ban đầu cho form (copy từ EmployeeList)
const initialFormData = {
  id: null, // Thêm id để form biết đang sửa hay thêm
  employee_code: '',
  full_name: '',
  department: '',
  position: '',
  email: '',
  phone: ''
};

// Các style còn lại (Search)
const styles = {
  input: { padding: '8px', border: '1px solid #ccc', borderRadius: '4px', flex: 1 },
  button: { padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white', marginRight: '5px' },
  btnPrimary: { backgroundColor: '#004aad' },
  btnSecondary: { backgroundColor: '#6c757d' },
  searchContainer: { marginBottom: '20px', display: 'flex', gap: '10px' }
};


function EmployeePage() {
  // --- TẤT CẢ STATE NẰM Ở ĐÂY ---
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Lỗi chung
  const [apiError, setApiError] = useState(null); // Lỗi của Form
  const [formData, setFormData] = useState(initialFormData);
  const [searchTerm, setSearchTerm] = useState('');

  // --- TẤT CẢ LOGIC API NẰM Ở ĐÂY ---

  // Hàm fetch (READ)
  const fetchEmployees = (currentSearchTerm) => {
    setLoading(true);
    setError(null);
    const encodedSearchTerm = encodeURIComponent(currentSearchTerm);
    
    apiFetch(`/api/employees?search=${encodedSearchTerm}`)
      .then(data => {
        setEmployees(data);
      })
      .catch(err => {
        setError(err.message);
        handleApiError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => { fetchEmployees(''); }, []);
  // Hàm xử lý SUBMIT FORM (Thêm MỚI hoặc CẬP NHẬT)
  const handleSubmit = (e) => {
    e.preventDefault();
    setApiError(null);
    
    const editingId = formData.id; 
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId
      ? `/api/employees/${editingId}`
      : `/api/employees`;

    apiFetch(url, {
      method: method,
      body: JSON.stringify(formData),
    })
    .then(resultData => {
       if (resultData) { 
            if (editingId) {
                setEmployees(employees.map(emp => emp.id === editingId ? resultData : emp));
            } else {
                setEmployees([resultData, ...employees]);
            }
            handleCancelEdit();
       }
    })
    .catch(err => {
      console.error(`Lỗi khi ${editingId ? 'cập nhật' : 'thêm'} nhân viên:`, err);
      setApiError(err.message);
      handleApiError(err);
    });
  };
  // Xử lý XÓA
  const handleDelete = (employeeId) => {
    if (!window.confirm('Bạn có chắc muốn xóa nhân viên này?')) return;
    setApiError(null);
    
    apiFetch(`/api/employees/${employeeId}`, { method: 'DELETE' })
      .then(() => {
        // 204 No Content, apiFetch trả về null
        setEmployees(employees.filter(emp => emp.id !== employeeId));
      })
      .catch(err => {
        console.error("Lỗi khi xóa nhân viên:", err);
        setApiError(err.message);
        handleApiError(err);
      });
  };

  // --- CÁC HÀM XỬ LÝ SỰ KIỆN ---

  // Hàm khi nhấn nút "SỬA" trên bảng
  const handleEditClick = (employee) => {
    const editData = {
        id: employee.id, // Quan trọng
        employee_code: employee.employee_code || '',
        full_name: employee.full_name || '',
        department: employee.department || '',
        position: employee.position || '',
        email: employee.email || '',
        phone: employee.phone || '',
    };
    setFormData(editData);
    setApiError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Hàm khi nhấn nút "HỦY BỎ" trên form
  const handleCancelEdit = () => {
    setFormData(initialFormData);
    setApiError(null);
  };
  
  // Xử lý TÌM KIẾM
  const handleSearchSubmit = (e) => {
      e.preventDefault();
      fetchEmployees(searchTerm);
  };
  
  const handleClearSearch = () => {
      setSearchTerm('');
      fetchEmployees('');
  };

  // --- RENDER ---
  return (
    <div>
      {/* Truyền state và hàm xử lý xuống cho Form */}
      <EmployeeForm
        formData={formData}
        setFormData={setFormData} // setFormData được EmployeeForm tự gọi
        handleSubmit={handleSubmit}
        handleCancelEdit={handleCancelEdit}
      />
      
      {/* Hiển thị lỗi của Form (nếu có) */}
      {apiError && <p style={{ color: 'red' }}>Lỗi Form: {apiError}</p>}


      {/* --- THANH TÌM KIẾM --- */}
      <h2>Danh sách Nhân sự</h2>
      <div style={styles.searchContainer}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'contents' }}>
            <input
              type="text"
              placeholder="Tìm theo Tên, Mã NV, Email..."
              style={styles.input}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" style={{...styles.button, ...styles.btnPrimary}}>
              Tìm kiếm
            </button>
        </form>
         <button type="button"
                style={{ ...styles.button, ...styles.btnSecondary}}
                onClick={handleClearSearch}>
           Xóa tìm kiếm
        </button>
      </div>

      {/* Hiển thị lỗi tải trang (nếu có) */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {/* Truyền state và hàm xử lý xuống cho Bảng */}
      {loading ? (
          <p>Đang tải dữ liệu...</p>
      ) : (
          <EmployeeTable
            employees={employees}
            handleEditClick={handleEditClick}
            handleDelete={handleDelete}
          />
      )}
    </div>
  );
}

export default EmployeePage;