import React from 'react';
// --- BƯỚC 1: IMPORT CSS MODULE ---
import styles from './TrainingForm.module.css';

function TrainingForm({ formData, setFormData, handleSubmit, handleCancelEdit, employees }) {

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const editingId = formData.id;

  return (
    <div>
      <h2>{editingId ? 'Cập nhật Chương trình Đào tạo' : 'Thêm Chương trình Đào tạo'}</h2>
      {/* --- BƯỚC 2: SỬ DỤNG CLASSNAME --- */}
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            
            <div className="form-group">
              <label htmlFor="employee_id" className="form-label">Nhân viên (*)</label>
              <select id="employee_id" name="employee_id" value={formData.employee_id} onChange={handleInputChange} required className="form-select">
                <option value="">-- Chọn nhân viên --</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.employee_code} - {emp.full_name}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="course_name" className="form-label">Tên khóa học (*)</label>
              <input type="text" id="course_name" name="course_name" value={formData.course_name} onChange={handleInputChange} required className="form-input" />
            </div>
            
            <div className="form-group">
              <label htmlFor="trainer_name" className="form-label">Người đào tạo</label>
              <input type="text" id="trainer_name" name="trainer_name" value={formData.trainer_name} onChange={handleInputChange} className="form-input" />
            </div>
            
            <div className="form-group">
              <label htmlFor="score" className="form-label">Điểm (0-100)</label>
              <input type="number" id="score" name="score" value={formData.score} onChange={handleInputChange} min="0" max="100" className="form-input" />
            </div>
            
            <div className="form-group">
              <label htmlFor="start_date" className="form-label">Ngày bắt đầu (*)</label>
              <input type="date" id="start_date" name="start_date" value={formData.start_date} onChange={handleInputChange} required className="form-input" />
            </div>
            
            <div className="form-group">
              <label htmlFor="end_date" className="form-label">Ngày kết thúc (*)</label>
              <input type="date" id="end_date" name="end_date" value={formData.end_date} onChange={handleInputChange} required className="form-input" />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '15px' }}>
            {editingId ? '💾 Lưu Cập nhật' : '➕ Thêm Đào tạo'}
          </button>
          
          {editingId && (
            <button type="button" className="btn btn-secondary" style={{ marginTop: '15px' }} onClick={handleCancelEdit}>Hủy</button>
          )}
        </form>
      </div>
    </div>
  );
}

export default TrainingForm;