import React, { useState, useEffect } from 'react';
import ContractForm from '../components/ContractForm';
import ContractTable from '../components/ContractTable';
import { apiFetch, handleApiError } from '../services/apiHelper';
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// State ban đầu cho form (copy từ ContractList)
const initialFormData = {
  id: null,
  employee_id: '',
  contract_code: '',
  contract_type: 'HĐ chính thức',
  start_date: '',
  end_date: '',
  status: 'Đang hiệu lực'
};

// Styles cho Search (copy từ EmployeePage)
const styles = {
  input: { padding: '8px', border: '1px solid #ccc', borderRadius: '4px', flex: 1 },
  button: { padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white', marginRight: '5px' },
  btnPrimary: { backgroundColor: '#004aad' },
  btnSecondary: { backgroundColor: '#6c757d' },
  searchContainer: { marginBottom: '20px', display: 'flex', gap: '10px' }
};

function ContractPage() {
  // --- STATE ---
  const [contracts, setContracts] = useState([]);
  const [employees, setEmployees] = useState([]); // State cho dropdown
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [searchTerm, setSearchTerm] = useState('');

  // --- LOGIC API ---

  // Hàm fetch (READ) Hợp đồng
  const fetchContracts = (currentSearchTerm) => {
    setLoading(true);
    setError(null);
    const encodedSearchTerm = encodeURIComponent(currentSearchTerm);
    
    apiFetch(`${apiUrl}/api/contract?search=${encodedSearchTerm}`)
      .then(data => { setContracts(data); setLoading(false); })
      .catch(err => { setError(err.message); handleApiError(err); setLoading(false); });
  };

  // Hàm fetch Nhân viên - CẬP NHẬT
  const fetchEmployees = () => {
    apiFetch(`${apiUrl}/api/employees?search=`)
      .then(data => { setEmployees(data); })
      .catch(err => {
        setError(prev => prev ? `${prev}. ${err.message}` : err.message);
        handleApiError(err);
      });
  };

  useEffect(() => { fetchContracts(''); fetchEmployees(); }, []);

  // Hàm SUBMIT (Create/Update) - CẬP NHẬT
  const handleSubmit = (e) => {
    e.preventDefault();
    setApiError(null);
    const editingId = formData.id;
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${apiUrl}/api/contract/${editingId}` : `${apiUrl}/api/contract`;

    apiFetch(url, {
      method: method,
      body: JSON.stringify(formData),
    })
    .then(resultData => {
        if (editingId) {
            setContracts(contracts.map(con => con.id === editingId ? resultData : con));
        } else {
            setContracts([resultData, ...contracts]);
        }
        handleCancelEdit();
    })
    .catch(err => {
      console.error(`Lỗi khi ${editingId ? 'cập nhật' : 'thêm'} hợp đồng:`, err);
      setApiError(err.message);
      handleApiError(err);
    });
  };

  // Hàm XÓA (Delete) - CẬP NHẬT
  const handleDelete = (contractId) => {
    if (!window.confirm('Bạn có chắc muốn xóa hợp đồng này?')) return;
    setApiError(null);
    
    apiFetch(`${apiUrl}/api/contract/${contractId}`, { method: 'DELETE' })
      .then(() => {
        setContracts(contracts.filter(con => con.id !== contractId));
      })
      .catch(err => {
        console.error("Lỗi khi xóa hợp đồng:", err);
        setApiError(err.message);
        handleApiError(err);
      });
  };

  // --- HÀM XỬ LÝ SỰ KIỆN ---

  // Hàm khi nhấn "SỬA"
  const handleEditClick = (contract) => {
    // Format lại ngày tháng
    const formattedContract = {
        ...contract,
        id: contract.id, // Đảm bảo có id
        employee_id: String(contract.employee_id), // Đảm bảo là string
        start_date: contract.start_date ? contract.start_date.split('T')[0] : '',
        end_date: contract.end_date ? contract.end_date.split('T')[0] : '',
    };
    setFormData(formattedContract);
    setApiError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Hàm khi nhấn "HỦY BỎ"
  const handleCancelEdit = () => {
    setFormData(initialFormData);
    setApiError(null);
  };

  // Xử lý TÌM KIẾM
  const handleSearchSubmit = (e) => {
      e.preventDefault();
      fetchContracts(searchTerm);
  };
  
  const handleClearSearch = () => {
      setSearchTerm('');
      fetchContracts('');
  };

  // --- RENDER ---
  return (
    <div>
      <ContractForm
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        handleCancelEdit={handleCancelEdit}
        employees={employees} // Truyền danh sách nhân viên xuống
      />

      {apiError && <p style={{ color: 'red' }}>Lỗi Form: {apiError}</p>}

      {/* --- THANH TÌM KIẾM --- */}
      <h2>Danh sách Hợp đồng</h2>
      <div style={styles.searchContainer}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'contents' }}>
            <input
              type="text"
              placeholder="Tìm theo Mã HĐ, Tên NV..."
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

      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {loading ? (
          <p>Đang tải dữ liệu...</p>
      ) : (
          <ContractTable
            contracts={contracts}
            handleEditClick={handleEditClick}
            handleDelete={handleDelete}
          />
      )}
    </div>
  );
}

export default ContractPage;