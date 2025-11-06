import React from 'react';
// --- BƯỚC 1: IMPORT CSS MODULE ---
import styles from './ContractForm.module.css';

function ContractForm({ formData, setFormData, handleSubmit, handleCancelEdit, employees }) {

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const editingId = formData.id;

  return (
    <div>
      <h2>{editingId ? 'Cập nhật Hợp đồng' : 'Thêm Hợp đồng Mới'}</h2>
      {/* --- BƯỚC 2: SỬ DỤNG CLASSNAME --- */}
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            
            <div className="form-group">
              <label htmlFor="employee_id" className="form-label">Nhân viên (*)</label>
              <select 
                id="employee_id" 
                name="employee_id" 
                value={formData.employee_id} 
                onChange={handleInputChange} 
                required 
                className="form-select"
              >
                <option value="">-- Chọn nhân viên --</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.employee_code} - {emp.full_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="contract_code" className="form-label">Mã HĐ (*)</label>
              <input type="text" id="contract_code" name="contract_code" 
                     value={formData.contract_code} onChange={handleInputChange} required 
                     className="form-input" />
            </div>

            <div className="form-group">
              <label htmlFor="contract_type" className="form-label">Loại HĐ</label>
              <select 
                id="contract_type" 
                name="contract_type" 
                value={formData.contract_type} 
                onChange={handleInputChange} 
                className="form-select"
              >
                <option value="HĐ chính thức">HĐ chính thức</option>
                <option value="HĐ thử việc">HĐ thử việc</option>
                <option value="Hợp đồng hợp tác">Hợp đồng hợp tác</option>
                <option value="HĐ thời vụ">HĐ thời vụ</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status" className="form-label">Trạng thái</label>
              <select 
                id="status" 
                name="status" 
                value={formData.status} 
                onChange={handleInputChange} 
                className="form-select"
              >
                <option value="Đang hiệu lực">Đang hiệu lực</option>
                <option value="Hết hạn">Hết hạn</option>
                <option value="Đã thanh lý">Đã thanh lý</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="start_date" className="form-label">Ngày bắt đầu</label>
              <input type="date" id="start_date" name="start_date" 
                     value={formData.start_date} onChange={handleInputChange} 
                     className="form-input" />
            </div>

            <div className="form-group">
              <label htmlFor="end_date" className="form-label">Ngày kết thúc</label>
              <input type="date" id="end_date" name="end_date" 
                     value={formData.end_date} onChange={handleInputChange} 
                     className="form-input" />
            </div>

          </div>
          
          <button type="submit" className="btn btn-primary" style={{ marginTop: '15px' }}>
            {editingId ? '💾 Lưu Cập nhật' : '➕ Thêm Hợp đồng'}
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

export default ContractForm;