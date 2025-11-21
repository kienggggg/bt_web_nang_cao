import React from 'react';
// --- BƯỚC 1: IMPORT CSS MODULE ---
import styles from './TrainingTable.module.css';

function TrainingTable({ trainings, handleEditClick, handleDelete }) {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const isAdmin = user.role === 'ADMIN';
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (trainings.length === 0) {
    return <p>Không tìm thấy khóa đào tạo nào.</p>;
  }

  return (
    // --- BƯỚC 2: SỬ DỤNG CLASSNAME ---
    <table className="table">
      <thead>
        <tr>
          <th className={styles.tableHeader}>Mã NV</th>
          <th className={styles.tableHeader}>Tên nhân viên</th>
          <th className={styles.tableHeader}>Khóa học</th>
          <th className={styles.tableHeader}>Người đào tạo</th>
          <th className={styles.tableHeader}>Ngày bắt đầu</th>
          <th className={styles.tableHeader}>Ngày kết thúc</th>
          <th className={styles.tableHeader}>Điểm</th>
          {isAdmin && <th className={styles.tableHeader}>Hành động</th>}
        </tr>
      </thead>
      <tbody>
        {trainings.map(t => (
          <tr key={t.id}>
            <td>{t.employee_code}</td>
            <td>{t.employee_name}</td>
            <td>{t.course_name}</td>
            <td>{t.trainer_name || '-'}</td>
            <td>{formatDate(t.start_date)}</td>
            <td>{formatDate(t.end_date)}</td>
            <td>{t.score !== null ? t.score : '-'}</td>
            {isAdmin && (
              <td>
                <button className="btn btn-warning" onClick={() => handleEditClick(t)}>Sửa</button>
                <button className="btn btn-danger" onClick={() => handleDelete(t.id)}>Xóa</button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TrainingTable;