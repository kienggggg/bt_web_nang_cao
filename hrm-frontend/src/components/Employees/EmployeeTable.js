import React from 'react';
import { Link } from 'react-router-dom';
// --- BƯỚC 1: IMPORT CSS MODULE ---
import styles from './EmployeeTable.module.css'; // File .module.css riêng
// (File index.css đã được import ở file index.js, không cần import ở đây)

function EmployeeTable({ employees, handleEditClick, handleDelete }) {
  
  if (employees.length === 0) {
     return <p>Không tìm thấy nhân viên nào.</p>;
  }
  return (
    <table className="table">
      <thead>
        <tr>
          <th className={styles.tableHeader}>Mã NV</th>
          <th className={styles.tableHeader}>Họ tên</th>
          <th className={styles.tableHeader}>Phòng ban</th>
          <th className={styles.tableHeader}>Chức vụ</th>
          <th className={styles.tableHeader}>SĐT</th>
          <th className={styles.tableHeader}>Email</th>
          <th className={styles.tableHeader}>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {employees.map(emp => (
          <tr key={emp.id}>
            <td>{emp.employee_code}</td>
            <td>
              <Link to={`/employees/${emp.id}`} className="table-link">
                {emp.full_name}
              </Link>
            </td>
            <td>{emp.department || '-'}</td>
            <td>{emp.position || '-'}</td>
            <td>{emp.phone || '-'}</td>
            <td>{emp.email || '-'}</td>
            <td>
              <button 
                className="btn btn-warning"
                onClick={() => handleEditClick(emp)}>
                Sửa
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => handleDelete(emp.id)}>
                Xóa
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default EmployeeTable;