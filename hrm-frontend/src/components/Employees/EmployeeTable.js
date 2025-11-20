import React from 'react';
import { Link } from 'react-router-dom';
import styles from './EmployeeTable.module.css';

function EmployeeTable({ employees, handleEditClick, handleDelete }) {
  
  // Hàm format tiền Việt Nam
  const formatCurrency = (value) => {
    if (!value) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  if (employees.length === 0) return <p>Không tìm thấy nhân viên nào.</p>;

  return (
    <table className="table">
      <thead>
        <tr>
          <th className={styles.tableHeader}>Mã NV</th>
          <th className={styles.tableHeader}>Họ tên</th>
          <th className={styles.tableHeader}>Phòng ban</th>
          <th className={styles.tableHeader}>Chức vụ</th>
          <th className={styles.tableHeader}>SĐT</th>
          <th className={styles.tableHeader}>Lương CB</th> {/* Cột mới */}
          <th className={styles.tableHeader}>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {employees.map(emp => (
          <tr key={emp.id}>
            <td>{emp.employee_code}</td>
            <td><Link to={`/employees/${emp.id}`} className="table-link">{emp.full_name}</Link></td>
            <td>{emp.department || '-'}</td>
            <td>{emp.position || '-'}</td>
            <td>{emp.phone || '-'}</td>
            <td>{formatCurrency(emp.salary)}</td> {/* Dữ liệu mới */}
            <td>
              <button className="btn btn-warning" onClick={() => handleEditClick(emp)}>Sửa</button>
              <button className="btn btn-danger" onClick={() => handleDelete(emp.id)}>Xóa</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export default EmployeeTable;