import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children }) {
  // 1. Kiểm tra xem token có trong localStorage không
  const token = localStorage.getItem('token');
  let location = useLocation();

  if (!token) {
    // 2. Nếu không có token, "đá" người dùng về trang /login
    // replace: thay thế lịch sử, để người dùng không thể "Back" lại
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Nếu có token, cho phép render component con (Dashboard, EmployeePage...)
  return children;
}

export default ProtectedRoute;