import React, { useState, useEffect } from 'react';
import CandidateForm from '../components/Candidate/CandidateForm';
import CandidateTable from '../components/Candidate/CandidateTable';
import { apiFetch, handleApiError } from '../services/apiHelper';
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// State ban đầu cho form
const initialFormData = {
  id: null,
  full_name: '',
  email: '',
  phone: '',
  position_applied: '',
  status: 'Mới', // Mặc định
  interview_date: ''
};

// Styles cho Search
const styles = {
  input: { padding: '8px', border: '1px solid #ccc', borderRadius: '4px', flex: 1 },
  button: { padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white', marginRight: '5px' },
  btnPrimary: { backgroundColor: '#004aad' },
  btnSecondary: { backgroundColor: '#6c757d' },
  searchContainer: { marginBottom: '20px', display: 'flex', gap: '10px' }
};

function CandidatePage() {
  // --- STATE ---
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [searchTerm, setSearchTerm] = useState('');

  const editingId = formData.id; // Lấy editingId từ formData

  // --- LOGIC API ---

  // Hàm fetch (READ) - CẬP NHẬT
  const fetchCandidates = (currentSearchTerm) => {
    setLoading(true);
    setError(null);
    const encodedSearchTerm = encodeURIComponent(currentSearchTerm);
    
    apiFetch(`/api/candidate?search=${encodedSearchTerm}`)
      .then(data => { setCandidates(data); setLoading(false); })
      .catch(err => { setError(err.message); handleApiError(err); setLoading(false); });
  };

  useEffect(() => { fetchCandidates(''); }, []);

  // Hàm SUBMIT (Create/Update) - CẬP NHẬT
  const handleSubmit = (e) => {
    e.preventDefault();
    setApiError(null);
    const dataToSubmit = { ...formData, interview_date: formData.interview_date || null };
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${apiUrl}/api/candidate/${editingId}` : `${apiUrl}/api/candidate`;

    apiFetch(url, {
      method: method,
      body: JSON.stringify(dataToSubmit),
    })
    .then(resultData => {
       if (editingId) {
           setCandidates(candidates.map(c => c.id === editingId ? resultData : c));
       } else {
           setCandidates([resultData, ...candidates]);
       }
       handleCancelEdit();
    })
    .catch(err => {
      console.error(`Lỗi khi ${editingId ? 'cập nhật' : 'thêm'} ứng viên:`, err);
      setApiError(err.message);
      handleApiError(err);
    });
  };

  // Hàm XÓA (Delete) - CẬP NHẬT
  const handleDelete = (candidateId) => {
    if (!window.confirm('Bạn có chắc muốn xóa ứng viên này?')) return;
    setApiError(null);
    
    apiFetch(`/api/candidate/${candidateId}`, { method: 'DELETE' })
      .then(() => {
        setCandidates(candidates.filter(c => c.id !== candidateId));
      })
      .catch(err => {
        console.error("Lỗi khi xóa ứng viên:", err);
        setApiError(err.message);
        handleApiError(err);
      });
  };

  // --- HÀM XỬ LÝ SỰ KIỆN ---

  // Hàm khi nhấn "SỬA"
  const handleEditClick = (candidate) => {
    // Format lại ngày giờ cho input datetime-local (YYYY-MM-DDTHH:mm)
    let formattedInterviewDate = '';
    if (candidate.interview_date) {
        // Cắt bỏ phần 'Z' (UTC) và giây/mili giây
        formattedInterviewDate = candidate.interview_date.slice(0, 16);
    }
    
    const formattedCandidate = {
        ...candidate,
        id: candidate.id,
        email: candidate.email || '',
        phone: candidate.phone || '',
        interview_date: formattedInterviewDate
    };
    setFormData(formattedCandidate);
    setApiError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Hàm khi nhấn "HỦY"
  const handleCancelEdit = () => {
    setFormData(initialFormData);
    setApiError(null);
  };
  
  // Xử lý TÌM KIẾM
  const handleSearchSubmit = (e) => { e.preventDefault(); fetchCandidates(searchTerm); };
  const handleClearSearch = () => { setSearchTerm(''); fetchCandidates(''); };

  // --- RENDER ---
  return (
    <div>
      <CandidateForm
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        handleCancelEdit={handleCancelEdit}
        // Trang này không cần prop 'employees'
      />

      {apiError && <p style={{ color: 'red' }}>Lỗi Form: {apiError}</p>}

      {/* --- THANH TÌM KIẾM --- */}
      <h2>Danh sách Ứng viên</h2>
      <div style={styles.searchContainer}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'contents' }}>
            <input 
              type="text" 
              placeholder="Tìm theo Tên, Email, Vị trí..." 
              style={styles.input} 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" style={{...styles.button, ...styles.btnPrimary}}>Tìm kiếm</button>
        </form>
        <button type="button" style={{ ...styles.button, ...styles.btnSecondary}} onClick={handleClearSearch}>Xóa tìm kiếm</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {loading ? (
          <p>Đang tải dữ liệu...</p>
      ) : (
          <CandidateTable
            candidates={candidates}
            handleEditClick={handleEditClick}
            handleDelete={handleDelete}
          />
      )}
    </div>
  );
}

export default CandidatePage;