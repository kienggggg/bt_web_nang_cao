import React from 'react';
// --- BƯỚC 1: IMPORT CSS MODULE ---
import styles from './CandidateTable.module.css';

function CandidateTable({ candidates, handleEditClick, handleDelete }) {

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString('vi-VN', options);
  };

  if (candidates.length === 0) {
    return <p>Không tìm thấy ứng viên nào.</p>;
  }

  return (
    // --- BƯỚC 2: SỬ DỤNG CLASSNAME ---
    <table className="table"> {/* Dùng class "table" chung */}
      <thead>
        <tr>
          {/* Dùng class "tableHeader" riêng */}
          <th className={styles.tableHeader}>Họ tên</th>
          <th className={styles.tableHeader}>Vị trí ứng tuyển</th>
          <th className={styles.tableHeader}>Email</th>
          <th className={styles.tableHeader}>Điện thoại</th>
          <th className={styles.tableHeader}>Trạng thái</th>
          <th className={styles.tableHeader}>Ngày phỏng vấn</th>
          <th className={styles.tableHeader}>CV</th>
          <th className={styles.tableHeader}>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {candidates.map(c => (
          <tr key={c.id}>
            <td>{c.full_name}</td>
            <td>{c.position_applied}</td>
            <td>{c.email || '-'}</td>
            <td>{c.phone || '-'}</td>
            <td>
              {c.cv_url ? ( 
                <a 
                  href={`${process.env.REACT_APP_API_URL}${c.cv_url}`} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{color: '#004aad', textDecoration: 'underline'}}
                >
                  Xem CV
                </a>
              ) : 'Không có'}
            </td>
            <td>{c.status}</td>
            <td>{formatDate(c.interview_date)}</td>
            <td>
              {/* Dùng class "btn" chung */}
              <button 
                className="btn btn-warning" 
                onClick={() => handleEditClick(c)}>
                Sửa
              </button>
              <button 
                className="btn btn-danger" 
                onClick={() => handleDelete(c.id)}>
                Xóa
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CandidateTable;