// File này giúp chúng ta không phải lặp lại code lấy token

// 1. Hàm lấy Headers (Bao gồm Token)
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    // Thêm header Authorization nếu có token
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// 2. Hàm xử lý lỗi (Nếu token hết hạn, tự động logout)
export const handleApiError = (error) => {
  console.error("Lỗi API:", error.message, "| Status:", error.status);
  
  // 401 (Unauthorized) hoặc 403 (Forbidden)
  if (error.status === 401 || error.status === 403) {
    // Token không hợp lệ hoặc hết hạn
    alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};

/**
 * 3. Hàm fetch "xịn" (wrapper)
 * Tự động thêm Token, tự động parse JSON, tự động ném lỗi
 */
export const apiFetch = async (url, options = {}) => {
  
  // Tự động thêm header (cho GET) hoặc giữ header cũ (cho POST/PUT)
  const defaultOptions = {
    headers: getAuthHeaders(),
  };

  // Gộp options người dùng (như method, body)
  const finalOptions = {
    ...defaultOptions,
    ...options,
  };

  // Đặc biệt: nếu có 'body', đảm bảo header đúng
  if (finalOptions.body) {
      finalOptions.headers = getAuthHeaders();
  }

  const response = await fetch(url, finalOptions);

  // Nếu response KHÔNG ok (4xx, 5xx)
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Lỗi không xác định' }));
    const error = new Error(errorData.error || `HTTP error! status: ${response.status}`);
    error.status = response.status; // Gắn status vào lỗi
    throw error; // Ném lỗi để .catch() bên ngoài bắt được
  }

  // Xử lý 204 No Content (cho DELETE)
  if (response.status === 204) {
    return null; 
  }

  return response.json(); // Trả về data
};