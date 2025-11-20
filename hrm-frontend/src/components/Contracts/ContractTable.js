import React from 'react';
// --- BƯỚC 1: IMPORT CSS MODULE ---
import styles from './ContractTable.module.css';

function ContractTable({ contracts, handleEditClick, handleDelete }) {

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (contracts.length === 0) {
    return <p>Không tìm thấy hợp đồng nào.</p>;
  }
  return (
    <table className="table">
      <thead>
        <tr>
          <th className={styles.tableHeader}>Mã HĐ</th>
          <th className={styles.tableHeader}>Tên nhân viên</th>
          <th className={styles.tableHeader}>Loại HĐ</th>
          <th className={styles.tableHeader}>Ngày bắt đầu</th>
          <th className={styles.tableHeader}>Ngày kết thúc</th>
          <th className={styles.tableHeader}>Trạng thái</th>
          <th className={styles.tableHeader}>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {contracts.map(con => (
          <tr key={con.id}>
            <td>{con.contract_code}</td>
            <td>{con.employee_name}</td>
            <td>{con.contract_type}</td>
            <td>{formatDate(con.start_date)}</td>
            <td>{formatDate(con.end_date)}</td>
            <td>{con.status}</td>
            <td>
              <button 
                className="btn btn-warning"
                onClick={() => handleEditClick(con)}>
                Sửa
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => handleDelete(con.id)}>
                Xóa
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ContractTable;