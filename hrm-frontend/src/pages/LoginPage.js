import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Styles riêng cho trang Login
const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f4f6f9'
  },
  loginBox: {
    width: '350px',
    padding: '30px',
    background: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  title: {
    textAlign: 'center',
    color: '#004aad',
    marginBottom: '25px'
  },
  formGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: '600'
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box' // Đảm bảo padding không làm vỡ layout
  },
  button: {
    width: '100%',
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#004aad',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '16px'
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: '10px'
  }
};

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 1. Tự động chuyển hướng nếu đã đăng nhập
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/'); // Nếu đã có token, bay về trang chủ
    }
  }, [navigate]);

  // 2. Xử lý submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    // Gọi API Đăng nhập (API này là public, không cần token)
    fetch(`${apiUrl}/api/auth/signin`, { // <-- SỬA /login thành /signin
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    .then(async response => {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Đăng nhập thất bại');
      }
      return data;
    })
    .then(data => {
      // 3. Đăng nhập thành công: Lưu Token và thông tin user
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // 4. Chuyển hướng về trang chủ
      // Chúng ta dùng reload để App.js tự động nhận diện token mới
      window.location.href = '/'; 
    })
    .catch(err => {
      console.error("Lỗi đăng nhập:", err);
      setError(err.message);
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h2 style={styles.title}>Đăng nhập HRM</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="username" style={styles.label}>Tên đăng nhập</label>
            <input
              type="text"
              id="username"
              style={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>Mật khẩu</label>
            <input
              type="password"
              id="password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" style={styles.button}>Đăng nhập</button>
          {error && <p style={styles.error}>{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default LoginPage;