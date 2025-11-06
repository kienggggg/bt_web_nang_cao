import React from 'react';
// --- BƯỚC 1: IMPORT CSS MODULE ---
import styles from './AssetForm.module.css';

// Danh sách trạng thái (copy từ AssetList) - Đây là logic, không phải style
const assetStatuses = ['Trong kho', 'Đang sử dụng', 'Hỏng', 'Thanh lý'];

function AssetForm({ formData, setFormData, handleSubmit, handleCancelEdit, employees }) {

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const editingId = formData.id;

  return (
    <div>
      <h2>{editingId ? 'Cập nhật Thông tin Tài sản' : 'Thêm Tài sản Mới'}</h2>
      {/* --- BƯỚC 2: SỬ DỤNG CLASSNAME --- */}
      <div className="form-container"> {/* Dùng class "form-container" chung */}
        <form onSubmit={handleSubmit}>
          
          {/* Dùng class "formGrid" riêng */}
          <div className={styles.formGrid}>
            
            <div className="form-group"> {/* Dùng class "form-group" chung */}
              <label htmlFor="asset_name" className="form-label">Tên tài sản (*)</label>
              <input type="text" id="asset_name" name="asset_name" value={formData.asset_name} onChange={handleInputChange} required className="form-input" />
            </div>
            
            <div className="form-group">
              <label htmlFor="asset_code" className="form-label">Mã tài sản (Nếu có)</label>
              <input type="text" id="asset_code" name="asset_code" value={formData.asset_code} onChange={handleInputChange} className="form-input" />
            </div>
            
            <div className="form-group">
              <label htmlFor="status" className="form-label">Trạng thái (*)</label>
              <select id="status" name="status" value={formData.status} onChange={handleInputChange} required className="form-select">
                {assetStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="employee_id" className="form-label">Gán cho nhân viên</label>
              <select id="employee_id" name="employee_id" value={formData.employee_id} onChange={handleInputChange} className="form-select">
                <option value="">-- Không gán (Trong kho) --</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.employee_code} - {emp.full_name}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="date_assigned" className="form-label">Ngày bàn giao (Nếu gán)</label>
              <input type="date" id="date_assigned" name="date_assigned"
                     value={formData.date_assigned} onChange={handleInputChange}
                     className="form-input" disabled={!formData.employee_id} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '15px' }}>
            {editingId ? '💾 Lưu Cập nhật' : '➕ Thêm Tài sản'}
          </button>
          
          {editingId && (
            <button type="button" className="btn btn-secondary" style={{ marginTop: '15px' }} onClick={handleCancelEdit}>Hủy</button>
          )}
        </form>
      </div>
    </div>
  );
}

export default AssetForm;