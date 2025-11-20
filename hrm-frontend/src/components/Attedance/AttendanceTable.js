import React from 'react';
// --- BƯỚC 1: IMPORT CSS MODULE ---
import styles from './AttendanceTable.module.css';

function AttendanceTable({ attendances, handleEditClick, handleDelete }) {

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (attendances.length === 0) {
    return <p>Không tìm thấy bản ghi chấm công nào.</p>;
  }

  return (
    // --- BƯỚC 2: SỬ DỤNG CLASSNAME ---
    <table className="table">
      <thead>
        <tr>
          <th className={styles.tableHeader}>Ngày</th>
          <th className={styles.tableHeader}>Mã NV</th>
          <th className={styles.tableHeader}>Tên nhân viên</th>
          <th className={styles.tableHeader}>Trạng thái</th>
          <th className={styles.tableHeader}>Ghi chú</th>
          <th className={styles.tableHeader}>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {attendances.map(att => (
          <tr key={att.id}>
            <td>{formatDate(att.date)}</td>
            <td>{att.employee_code}</td>
            <td>{att.employee_name}</td>
            <td>{att.status}</td>
            <td>{att.notes || '-'}</td>
            <td>
              <button 
                className="btn btn-warning" 
                onClick={() => handleEditClick(att)}>
                Sửa
              </button>
              <button 
                className="btn btn-danger" 
                onClick={() => handleDelete(att.id)}>
                Xóa
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AttendanceTable;