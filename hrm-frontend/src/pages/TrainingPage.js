import React, { useState, useEffect } from 'react';
import TrainingForm from '../components/Training/TrainingForm';
import TrainingTable from '../components/Training/TrainingTable';
import { apiFetch, handleApiError } from '../services/apiHelper';
import { exportToExcel } from '../services/excelHelper'; 

// State ban đầu cho form
const initialFormData = {
  id: null,
  employee_id: '',
  course_name: '',
  trainer_name: '',
  start_date: '',
  end_date: '',
  score: ''
};

// Styles
const styles = {
  input: { padding: '8px', border: '1px solid #ccc', borderRadius: '4px', flex: 1 },
  button: { padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white', marginRight: '5px' },
  btnPrimary: { backgroundColor: '#004aad' },
  btnSecondary: { backgroundColor: '#6c757d' },
  searchContainer: { marginBottom: '20px', display: 'flex', gap: '10px' }
};

function TrainingPage() {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const isAdmin = user.role === 'ADMIN';
  // --- STATE ---
  const [trainings, setTrainings] = useState([]);
  const [employees, setEmployees] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [searchTerm, setSearchTerm] = useState('');

  const editingId = formData.id; 

  // --- LOGIC API ---

  // Hàm fetch (READ) Đào tạo
  const fetchTrainings = (currentSearchTerm) => {
    setLoading(true);
    setError(null);
    const encodedSearchTerm = encodeURIComponent(currentSearchTerm);
    
    apiFetch(`/api/training?search=${encodedSearchTerm}`)
      .then(data => { setTrainings(data); setLoading(false); })
      .catch(err => { setError(err.message); handleApiError(err); setLoading(false); });
  };

  // Hàm fetch Nhân viên
  const fetchEmployees = () => {
    apiFetch(`/api/employees?search=`)
      .then(data => setEmployees(data))
      .catch(err => {
        setError(prev => prev ? `${prev}. ${err.message}` : err.message);
        handleApiError(err);
      });
  };

  useEffect(() => { fetchTrainings(''); fetchEmployees(); }, []);

  // Hàm SUBMIT (Create/Update)
  const handleSubmit = (e) => {
    e.preventDefault();
    setApiError(null);

    const dataToSubmit = { ...formData };
    // Validate điểm số
    dataToSubmit.score = dataToSubmit.score ? parseInt(dataToSubmit.score, 10) : null;
    if (dataToSubmit.score !== null && (isNaN(dataToSubmit.score) || dataToSubmit.score < 0 || dataToSubmit.score > 100)) {
        setApiError("Điểm đánh giá phải là số từ 0 đến 100.");
        return;
    }

    const method = editingId ? 'PUT' : 'POST';
    
    // --- SỬA LỖI Ở ĐÂY: Xóa ${apiUrl}, chỉ dùng đường dẫn tương đối ---
    const url = editingId ? `/api/training/${editingId}` : `/api/training`;

    apiFetch(url, {
      method: method,
      body: JSON.stringify(dataToSubmit),
    })
    .then(resultData => {
      if (editingId) {
        setTrainings(trainings.map(t => t.id === editingId ? resultData : t));
      } else {
        setTrainings([resultData, ...trainings]);
      }
      handleCancelEdit();
    })
    .catch(err => {
      console.error(`Lỗi khi ${editingId ? 'cập nhật' : 'thêm'} đào tạo:`, err);
      setApiError(err.message);
      handleApiError(err);
    });
  };

  // Hàm XÓA
  const handleDelete = (trainingId) => {
    if (!window.confirm('Bạn có chắc muốn xóa khóa đào tạo này?')) return;
    setApiError(null);
    
    apiFetch(`/api/training/${trainingId}`, { method: 'DELETE' })
      .then(() => {
        setTrainings(trainings.filter(t => t.id !== trainingId));
      })
      .catch(err => {
        console.error("Lỗi khi xóa đào tạo:", err);
        setApiError(err.message);
        handleApiError(err);
      });
  };

  // --- HÀM XỬ LÝ SỰ KIỆN ---
  const handleEditClick = (training) => {
    const formattedTraining = {
        ...training,
        id: training.id, 
        employee_id: training.employee_id ? String(training.employee_id) : '',
        start_date: training.start_date ? training.start_date.split('T')[0] : '',
        end_date: training.end_date ? training.end_date.split('T')[0] : '',
        score: training.score !== null ? String(training.score) : ''
    };
    setFormData(formattedTraining);
    setApiError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setFormData(initialFormData);
    setApiError(null);
  };
  
  const handleSearchSubmit = (e) => { e.preventDefault(); fetchTrainings(searchTerm); };
  const handleClearSearch = () => { setSearchTerm(''); fetchTrainings(''); };
  
  const handleExport = () => {
    if (trainings.length === 0) {
        alert("Không có dữ liệu để xuất!");
        return;
    }
    exportToExcel(trainings, 'DS_DaoTao');
  };

  // --- RENDER ---
  return (
    <div>
      {isAdmin && (
        <TrainingForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          handleCancelEdit={handleCancelEdit}
          employees={employees}
        />
      )}

      {apiError && <p style={{ color: 'red' }}>Lỗi Form: {apiError}</p>}

      <h2>Danh sách Đào tạo</h2>
      
      {/* Đã xóa phần code bị lặp (Duplicate) ở đây */}
      <div style={styles.searchContainer}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'contents' }}>
            <input 
              type="text" 
              placeholder="Tìm theo Khóa học, Tên NV, Người ĐT..." 
              style={styles.input} 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" style={{...styles.button, ...styles.btnPrimary}}>Tìm kiếm</button>
        </form>
        
        <button type="button" style={{ ...styles.button, ...styles.btnSecondary}} onClick={handleClearSearch}>
          Xóa tìm kiếm
        </button>

        <button 
            type="button" 
            style={{ ...styles.button, backgroundColor: '#28a745', marginLeft: 'auto' }} 
            onClick={handleExport}
        >
            📊 Xuất Excel
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {loading ? (
          <p>Đang tải dữ liệu...</p>
      ) : (
          <TrainingTable
            trainings={trainings}
            handleEditClick={handleEditClick}
            handleDelete={handleDelete}
          />
      )}
    </div>
  );
}

export default TrainingPage;