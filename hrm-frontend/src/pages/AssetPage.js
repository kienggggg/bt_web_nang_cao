import React, { useState, useEffect } from 'react';
import AssetForm from '../components/AssetForm';
import AssetTable from '../components/AssetTable';
import { apiFetch, handleApiError } from '../services/apiHelper';
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const initialFormData = {
  id: null, asset_name: '', asset_code: '', date_assigned: '',
  status: 'Trong kho', employee_id: ''
};
const styles = {
  input: { padding: '8px', border: '1px solid #ccc', borderRadius: '4px', flex: 1 },
  button: { padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white', marginRight: '5px' },
  btnPrimary: { backgroundColor: '#004aad' },
  btnSecondary: { backgroundColor: '#6c757d' },
  searchContainer: { marginBottom: '20px', display: 'flex', gap: '10px' }
};

function AssetPage() {
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [searchTerm, setSearchTerm] = useState('');

  // --- LOGIC API ---
  const fetchAssets = (currentSearchTerm) => {
    setLoading(true);
    setError(null);
    const encodedSearchTerm = encodeURIComponent(currentSearchTerm);
    
    apiFetch(`${apiUrl}/api/asset?search=${encodedSearchTerm}`)
      .then(data => { setAssets(data); setLoading(false); })
      .catch(err => { setError(err.message); handleApiError(err); setLoading(false); });
  };
  const fetchEmployees = () => {
    apiFetch(`${apiUrl}/api/employees?search=`)
      .then(data => setEmployees(data))
      .catch(err => {
        setError(prev => prev ? `${prev}. ${err.message}` : err.message);
        handleApiError(err);
      });
  };
  useEffect(() => { fetchAssets(''); fetchEmployees(); }, []);

  // Hàm SUBMIT (Create/Update) - ĐÃ SỬA LỖI
  const handleSubmit = (e) => {
    e.preventDefault();
    setApiError(null);
    
    // --- SỬA LỖI TẠI ĐÂY ---
    // Kiểm tra `formData.id` thay vì `editingId`
    const editingId = formData.id; 
    // --- HẾT SỬA LỖI ---

    const dataToSubmit = {
      ...formData,
      employee_id: formData.employee_id || null,
      date_assigned: formData.employee_id ? formData.date_assigned : null
    };
     if (dataToSubmit.employee_id && !dataToSubmit.date_assigned) {
         setApiError('Ngày bàn giao là bắt buộc khi gán tài sản cho nhân viên.');
         return;
     }

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${apiUrl}/api/asset/${editingId}` : `${apiUrl}/api/asset`;

    apiFetch(url, {
      method: method,
      body: JSON.stringify(dataToSubmit),
    })
    .then(resultData => {
        if (editingId) {
            setAssets(assets.map(a => a.id === editingId ? resultData : a));
        } else {
            setAssets([resultData, ...assets]);
        }
        handleCancelEdit();
    })
    .catch(err => {
      console.error(`Lỗi khi ${editingId ? 'cập nhật' : 'thêm'} tài sản:`, err);
      setApiError(err.message);
      handleApiError(err);
    });
  };

  // Hàm XÓA (Delete) - (Đã đúng)
  const handleDelete = (assetId) => {
    if (!window.confirm('Bạn có chắc muốn xóa tài sản này?')) return;
    setApiError(null);
    
    apiFetch(`${apiUrl}/api/asset/${assetId}`, { method: 'DELETE' })
      .then(() => {
        setAssets(assets.filter(a => a.id !== assetId));
      })
      .catch(err => {
        console.error("Lỗi khi xóa tài sản:", err);
        setApiError(err.message);
        handleApiError(err);
      });
  };

  // Hàm khi nhấn "SỬA" - (Đã đúng)
  const handleEditClick = (asset) => {
    const formattedAsset = {
        ...asset,
        id: asset.id,
        employee_id: asset.employee_id ? String(asset.employee_id) : '',
        date_assigned: asset.date_assigned ? asset.date_assigned.split('T')[0] : '',
        asset_code: asset.asset_code || ''
    };
    setFormData(formattedAsset);
    setApiError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Hàm khi nhấn "HỦY" - ĐÃ SỬA LỖI
  const handleCancelEdit = () => {
    // --- SỬA LỖI TẠI ĐÂY ---
    // Chỉ cần reset form, không gọi `setEditingId`
    setFormData(initialFormData);
    setApiError(null);
    // --- HẾT SỬA LỖI ---
  };

  // Xử lý TÌM KIẾM - (Đã đúng)
  const handleSearchSubmit = (e) => { e.preventDefault(); fetchAssets(searchTerm); };
  const handleClearSearch = () => { setSearchTerm(''); fetchAssets(''); };
  
  // --- RENDER --- (Đã đúng)
  return (
    <div>
      <AssetForm
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        handleCancelEdit={handleCancelEdit}
        employees={employees}
      />
      {apiError && <p style={{ color: 'red' }}>Lỗi Form: {apiError}</p>}
      <h2>Danh sách Tài sản</h2>
      <div style={styles.searchContainer}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'contents' }}>
            <input 
              type="text" 
              placeholder="Tìm theo Tên TS, Mã TS, Tên NV, Trạng thái..." 
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
          <AssetTable
            assets={assets}
            handleEditClick={handleEditClick}
            handleDelete={handleDelete}
          />
      )}
    </div>
  );
}

export default AssetPage;