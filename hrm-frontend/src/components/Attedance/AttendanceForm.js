import React from 'react';
// --- BƯỚC 1: IMPORT CSS MODULE ---
import styles from './AttendanceForm.module.css';

// Logic, không phải style
const attendanceStatuses = ['Đi làm', 'Nghỉ phép', 'Nghỉ ốm', 'Đi muộn', 'Về sớm', 'Vắng'];

function AttendanceForm({ formData, setFormData, handleSubmit, handleCancelEdit, employees }) {

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const editingId = formData.id;

  return (
    <div>
      <h2>{editingId ? 'Cập nhật Chấm công' : 'Thêm Chấm công'}</h2>
      {/* --- BƯỚC 2: SỬ DỤNG CLASSNAME --- */}
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {/* Dùng class "formGrid" riêng */}
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
              <label htmlFor="date" className="form-label">Ngày (*)</label>
              <input type="date" id="date" name="date" value={formData.date} onChange={handleInputChange} required className="form-input" />
            </div>
            
            <div className="form-group">
              <label htmlFor="status" className="form-label">Trạng thái (*)</label>
              <select id="status" name="status" value={formData.status} onChange={handleInputChange} required className="form-select">
                {attendanceStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            
            {/* Dùng class "notesGroup" riêng */}
            <div className={`form-group ${styles.notesGroup}`}>
              <label htmlFor="notes" className="form-label">Ghi chú</label>
              <textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} className="form-textarea"></textarea>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '15px' }}>
            {editingId ? '💾 Lưu Cập nhật' : '➕ Thêm Chấm công'}
          </button>
          
          {editingId && (
            <button type="button" className="btn btn-secondary" style={{ marginTop: '15px' }} onClick={handleCancelEdit}>Hủy</button>
          )}
        </form>
      </div>
    </div>
  );
}

export default AttendanceForm;