import React, { useState } from 'react';
import { apiFetch, handleApiError } from '../services/apiHelper';

const styles = {
  container: {
    background: '#fff',
    padding: '30px',
    borderRadius: '8px',
    maxWidth: '600px',
    margin: '0 auto', // Căn giữa
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
  },
  header: { color: '#004aad', borderBottom: '1px solid #eee', paddingBottom: '10px' },
  infoGroup: { marginBottom: '20px' },
  label: { fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#555' },
  value: { padding: '10px', background: '#f9f9f9', borderRadius: '4px', border: '1px solid #eee' },
  input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', marginTop: '5px' },
  btn: {
    background: '#004aad', color: 'white', border: 'none', padding: '10px 20px',
    borderRadius: '4px', cursor: 'pointer', marginTop: '15px', fontSize: '16px'
  },
  error: { color: 'red', marginTop: '10px' },
  success: { color: 'green', marginTop: '10px' }
};

function ProfilePage() {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  
  const [passData, setPassData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setPassData({ ...passData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (passData.newPassword !== passData.confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu mới không khớp.' });
      return;
    }

    try {
      const response = await apiFetch('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({
          oldPassword: passData.oldPassword,
          newPassword: passData.newPassword
        })
      });

      if (response) {
        setMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
        setPassData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
        // apiFetch sẽ throw error nếu status != 200
        // Lỗi 400 từ backend sẽ nhảy vào đây
        setMessage({ type: 'error', text: err.message || 'Đổi mật khẩu thất bại.' });
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>👤 Hồ sơ cá nhân</h2>
      
      <div style={styles.infoGroup}>
        <label style={styles.label}>Họ và tên:</label>
        <div style={styles.value}>{user.full_name || 'Chưa cập nhật'}</div>
      </div>
      <div style={styles.infoGroup}>
        <label style={styles.label}>Tên đăng nhập:</label>
        <div style={styles.value}>{user.username}</div>
      </div>
      <div style={styles.infoGroup}>
        <label style={styles.label}>Vai trò:</label>
        <div style={styles.value}>
            {user.role === 'ADMIN' ? 'Quản trị viên' : 'Nhân viên'}
        </div>
      </div>

      <hr style={{ margin: '30px 0', border: '0', borderTop: '1px solid #eee' }} />

      <h3 style={{ color: '#333' }}>🔐 Đổi mật khẩu</h3>
      <form onSubmit={handleSubmit}>
        <div style={styles.infoGroup}>
          <label style={styles.label}>Mật khẩu cũ</label>
          <input type="password" name="oldPassword" value={passData.oldPassword} onChange={handleChange} style={styles.input} required />
        </div>
        <div style={styles.infoGroup}>
          <label style={styles.label}>Mật khẩu mới</label>
          <input type="password" name="newPassword" value={passData.newPassword} onChange={handleChange} style={styles.input} required />
        </div>
        <div style={styles.infoGroup}>
          <label style={styles.label}>Xác nhận mật khẩu mới</label>
          <input type="password" name="confirmPassword" value={passData.confirmPassword} onChange={handleChange} style={styles.input} required />
        </div>

        {message.text && (
          <p style={message.type === 'error' ? styles.error : styles.success}>
            {message.text}
          </p>
        )}

        <button type="submit" style={styles.btn}>Cập nhật mật khẩu</button>
      </form>
    </div>
  );
}

export default ProfilePage;