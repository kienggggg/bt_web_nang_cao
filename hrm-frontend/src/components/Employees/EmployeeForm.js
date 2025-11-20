import React from 'react';
// --- BƯỚC 1: IMPORT CSS MODULE ---
import styles from './EmployeeForm.module.css';

function EmployeeForm({ formData, setFormData, handleSubmit, handleCancelEdit }) {
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const editingId = formData.id;

  return (
    <div>
      <h2>{editingId ? 'Cập nhật Nhân sự' : 'Thêm Nhân sự Mới'}</h2>
      {/* --- BƯỚC 2: SỬ DỤNG CLASSNAME --- */}
      <div className="form-container"> {/* Dùng class "form-container" chung */}
        <form onSubmit={handleSubmit}>
          
          {/* Dùng class "formGrid" RIÊNG từ EmployeeForm.module.css */}
          <div className={styles.formGrid}>
            
            <div className="form-group"> {/* Dùng class "form-group" chung */}
              <label htmlFor="employee_code" className="form-label">Mã NV (*)</label>
              <input type="text" id="employee_code" name="employee_code"
                     value={formData.employee_code} onChange={handleInputChange} required
                     className="form-input" />
            </div>
            
            <div className="form-group">
              <label htmlFor="full_name" className="form-label">Họ tên (*)</label>
              <input type="text" id="full_name" name="full_name"
                     value={formData.full_name} onChange={handleInputChange} required
                     className="form-input" />
            </div>
            
            <div className="form-group">
              <label htmlFor="department" className="form-label">Phòng ban</label>
              <input type="text" id="department" name="department"
                     value={formData.department} onChange={handleInputChange}
                     className="form-input" />
            </div>
            
            <div className="form-group">
              <label htmlFor="position" className="form-label">Chức vụ</label>
              <input type="text" id="position" name="position"
                     value={formData.position} onChange={handleInputChange}
                     className="form-input" />
            </div>
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" id="email" name="email"
                     value={formData.email} onChange={handleInputChange}
                     className="form-input" />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone" className="form-label">Số điện thoại</label>
              <input type="text" id="phone" name="phone"
                     value={formData.phone} onChange={handleInputChange}
                     className="form-input" />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '15px' }}>
            {editingId ? '💾 Lưu Cập nhật' : '➕ Thêm Nhân sự'}
          </button>

          {editingId && (
            <button type="button"
                    className="btn btn-secondary" style={{ marginTop: '15px' }}
                    onClick={handleCancelEdit}>
              Hủy
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default EmployeeForm;