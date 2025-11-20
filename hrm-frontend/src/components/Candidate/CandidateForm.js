import React from 'react';
// --- BƯỚC 1: IMPORT CSS MODULE ---
import styles from './CandidateForm.module.css';

// Logic, không phải style
const candidateStatuses = ['Mới', 'Đã liên hệ', 'Hẹn phỏng vấn', 'Trúng tuyển', 'Thất bại'];

function CandidateForm({ formData, setFormData, handleSubmit, handleCancelEdit }) {

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const editingId = formData.id;

  return (
    <div>
      <h2>{editingId ? 'Cập nhật Ứng viên' : 'Thêm Ứng viên Mới'}</h2>
      {/* --- BƯỚC 2: SỬ DỤNG CLASSNAME --- */}
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {/* Dùng class "formGrid" riêng */}
          <div className={styles.formGrid}>
            
            <div className="form-group">
              <label htmlFor="full_name" className="form-label">Họ tên (*)</label>
              <input type="text" id="full_name" name="full_name" value={formData.full_name} onChange={handleInputChange} required className="form-input" />
            </div>

            <div className="form-group">
              <label htmlFor="position_applied" className="form-label">Vị trí ứng tuyển (*)</label>
              <input type="text" id="position_applied" name="position_applied" value={formData.position_applied} onChange={handleInputChange} required className="form-input" />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="form-input" />
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">Số điện thoại</label>
              <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="form-input" />
            </div>
            
            <div className="form-group">
              <label htmlFor="status" className="form-label">Trạng thái</label>
              <select id="status" name="status" value={formData.status} onChange={handleInputChange} className="form-select">
                {candidateStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="interview_date" className="form-label">Ngày phỏng vấn</label>
              <input type="datetime-local" id="interview_date" name="interview_date" value={formData.interview_date} onChange={handleInputChange} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Đính kèm CV (PDF/Ảnh)</label>
              <input 
                type="file" 
                name="cv" 
                onChange={(e) => setFormData({...formData, cvFile: e.target.files[0]})} 
                className="form-input" 
                accept=".pdf,.doc,.docx,.jpg,.png"
              />
              {/* Nếu đang sửa và đã có CV cũ thì hiện link */}
              {formData.cv_url && !formData.cvFile && (
                <div style={{marginTop: '5px', fontSize: '12px'}}>
                  Đang có: <a href={`${process.env.REACT_APP_API_URL}${formData.cv_url}`} target="_blank" rel="noreferrer">Xem CV hiện tại</a>
                </div>
              )}
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ marginTop: '15px' }}>
            {editingId ? '💾 Lưu Cập nhật' : '➕ Thêm Ứng viên'}
          </button>
          
          {editingId && (
            <button type="button" className="btn btn-secondary" style={{ marginTop: '15px' }} onClick={handleCancelEdit}>Hủy</button>
          )}
        </form>
      </div>
    </div>
  );
}

export default CandidateForm;