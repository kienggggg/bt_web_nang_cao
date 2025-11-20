import React, { useState, useEffect } from 'react';
import { apiFetch, handleApiError } from '../services/apiHelper';

const styles = {
  container: { padding: '20px', background: '#fff', borderRadius: '8px' },
  header: { color: '#004aad', marginBottom: '20px' },
  formGroup: { marginBottom: '15px' },
  label: { display: 'block', marginBottom: '5px', fontWeight: 'bold' },
  input: { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' },
  select: { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' },
  textarea: { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', height: '80px' },
  btn: { padding: '8px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white', marginRight: '10px' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
  th: { background: '#004aad', color: 'white', padding: '10px', textAlign: 'left' },
  td: { borderBottom: '1px solid #eee', padding: '10px' },
  badge: { padding: '4px 8px', borderRadius: '12px', fontSize: '12px', color: 'white' }
};

const getStatusBadge = (status) => {
    if (status === 'APPROVED') return <span style={{...styles.badge, background: 'green'}}>Đã duyệt</span>;
    if (status === 'REJECTED') return <span style={{...styles.badge, background: 'red'}}>Từ chối</span>;
    return <span style={{...styles.badge, background: '#f0ad4e'}}>Chờ duyệt</span>;
};

function RequestPage() {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const isAdmin = user.role === 'ADMIN';

  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({
    type: 'UPDATE_INFO',
    note: '',
    // Payload giả định: ID nhân viên và thông tin muốn sửa
    // (Lưu ý: Để chức năng tự động cập nhật chạy, user cần nhập đúng ID nhân viên của mình - tạm thời nhập tay)
    empId: '', 
    newPhone: '',
    newEmail: ''
  });

  // --- FETCH DATA ---
  const fetchRequests = () => {
    // Admin xem được tất cả (API getAllRequests)
    // Nhân viên tạm thời xem danh sách chung (đúng ra cần API getMyRequests, nhưng dùng tạm cái này để test)
    apiFetch('/api/requests')
      .then(data => setRequests(data))
      .catch(err => handleApiError(err));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // --- SUBMIT REQUEST (Nhân viên) ---
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
        employee_id: formData.empId, // Backend cần cái này để update
        phone: formData.newPhone,
        email: formData.newEmail
    };

    apiFetch('/api/requests', {
        method: 'POST',
        body: JSON.stringify({
            type: formData.type,
            note: formData.note,
            payload: payload 
        })
    }).then(() => {
        alert("Gửi yêu cầu thành công!");
        fetchRequests(); // Load lại bảng
    }).catch(err => alert(err.message));
  };

  // --- PROCESS REQUEST (Admin) ---
  const handleProcess = (id, status) => {
      if(!window.confirm(`Bạn chắc chắn muốn ${status === 'APPROVED' ? 'DUYỆT' : 'TỪ CHỐI'} yêu cầu này?`)) return;

      apiFetch(`/api/requests/${id}/process`, {
          method: 'PUT',
          body: JSON.stringify({ status, comment: 'Đã xử lý bởi Admin' })
      }).then(() => {
          alert("Xử lý thành công!");
          fetchRequests();
      }).catch(err => alert(err.message));
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>📝 Quản lý Yêu cầu & Phê duyệt</h2>

      {/* --- PHẦN GỬI YÊU CẦU (Ai cũng thấy) --- */}
      <div style={{ marginBottom: '30px', padding: '15px', background: '#f9f9f9', borderRadius: '8px' }}>
          <h4>Gửi yêu cầu mới</h4>
          <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ flex: 1 }}>
                      <label style={styles.label}>Loại yêu cầu</label>
                      <select style={styles.select} value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                          <option value="UPDATE_INFO">Cập nhật thông tin cá nhân</option>
                          <option value="LEAVE">Xin nghỉ phép</option>
                          <option value="OTHER">Khác</option>
                      </select>
                  </div>
                  <div style={{ flex: 1 }}>
                      <label style={styles.label}>ID Nhân sự của bạn (*)</label>
                      <input type="number" style={styles.input} placeholder="Nhập ID (VD: 1, 2...)" 
                             value={formData.empId} onChange={e => setFormData({...formData, empId: e.target.value})} required />
                  </div>
              </div>
              
              {formData.type === 'UPDATE_INFO' && (
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input type="text" style={styles.input} placeholder="SĐT mới" value={formData.newPhone} onChange={e => setFormData({...formData, newPhone: e.target.value})} />
                    <input type="text" style={styles.input} placeholder="Email mới" value={formData.newEmail} onChange={e => setFormData({...formData, newEmail: e.target.value})} />
                  </div>
              )}

              <div style={styles.formGroup}>
                  <label style={styles.label}>Ghi chú / Lý do</label>
                  <textarea style={styles.textarea} value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})}></textarea>
              </div>
              <button type="submit" style={{...styles.btn, background: '#28a745'}}>Gửi yêu cầu</button>
          </form>
      </div>

      {/* --- PHẦN DANH SÁCH (Dành cho Admin duyệt) --- */}
      <h4>Danh sách Yêu cầu cần xử lý</h4>
      <table style={styles.table}>
          <thead>
              <tr>
                  <th style={styles.th}>Người gửi</th>
                  <th style={styles.th}>Loại</th>
                  <th style={styles.th}>Nội dung</th>
                  <th style={styles.th}>Trạng thái</th>
                  <th style={styles.th}>Ngày gửi</th>
                  {isAdmin && <th style={styles.th}>Hành động</th>}
              </tr>
          </thead>
          <tbody>
              {requests.map(req => (
                  <tr key={req.id}>
                      <td style={styles.td}>
                          <strong>{req.full_name}</strong><br/>
                          <small>({req.username})</small>
                      </td>
                      <td style={styles.td}>
                          {req.request_type === 'UPDATE_INFO' ? 'Cập nhật TT' : req.request_type}
                      </td>
                      <td style={styles.td}>
                          {req.approver_comment /* Ghi chú của nhân viên tạm lưu vào đây */}
                      </td>
                      <td style={styles.td}>{getStatusBadge(req.status)}</td>
                      <td style={styles.td}>{new Date(req.created_at).toLocaleDateString('vi-VN')}</td>
                      
                      {isAdmin && (
                          <td style={styles.td}>
                              {req.status === 'PENDING' && (
                                  <>
                                    <button style={{...styles.btn, background: '#007bff', fontSize: '12px'}} 
                                            onClick={() => handleProcess(req.id, 'APPROVED')}>Duyệt</button>
                                    <button style={{...styles.btn, background: '#dc3545', fontSize: '12px'}} 
                                            onClick={() => handleProcess(req.id, 'REJECTED')}>Từ chối</button>
                                  </>
                              )}
                          </td>
                      )}
                  </tr>
              ))}
          </tbody>
      </table>
    </div>
  );
}

export default RequestPage;