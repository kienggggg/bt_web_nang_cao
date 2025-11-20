// hrm-frontend/src/services/apiHelper.js

// 1. ĐỊNH NGHĨA BASE URL
// Khi chạy local, nó sẽ lấy biến REACT_APP_API_URL trong file .env
// Nếu không tìm thấy, nó sẽ dùng chuỗi rỗng (nhưng khuyên là PHẢI CÓ)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001'; 

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const handleApiError = (error) => {
  console.error("Lỗi API:", error.message);
  if (error.status === 401 || error.status === 403) {
    alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};

export const apiFetch = async (endpoint, options = {}) => {
  // 2. GHÉP URL: Base URL + Endpoint (ví dụ: https://railway... + /api/employees)
  // Lưu ý: endpoint nên bắt đầu bằng dấu /
  const url = `${API_BASE_URL}${endpoint}`; 
  console.log(">>> Đang gọi API tới:", url);

  const defaultOptions = {
    headers: getAuthHeaders(),
  };

  const finalOptions = {
    ...defaultOptions,
    ...options,
  };

  if (finalOptions.body && !(finalOptions.body instanceof FormData)) {
     // Nếu body là object JSON thì stringify, còn FormData (upload ảnh) thì để nguyên
     if(typeof finalOptions.body === 'object') {
         finalOptions.body = JSON.stringify(finalOptions.body);
     }
  }

  // Log ra để debug xem đang gọi đi đâu
  // console.log(`Calling API: ${url}`); 

  const response = await fetch(url, finalOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Lỗi không xác định' }));
    const error = new Error(errorData.error || `HTTP error! status: ${response.status}`);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return null; 
  }

  return response.json();
};