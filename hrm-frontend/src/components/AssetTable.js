import React from 'react';
// --- BƯỚC 1: IMPORT CSS MODULE ---
import styles from './AssetTable.module.css';

function AssetTable({ assets, handleEditClick, handleDelete }) {

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (assets.length === 0) {
    return <p>Không tìm thấy tài sản nào.</p>;
  }

  return (
    // --- BƯỚC 2: SỬ DỤNG CLASSNAME ---
    <table className="table"> {/* Dùng class "table" chung */}
      <thead>
        <tr>
          {/* Dùng class "tableHeader" riêng */}
          <th className={styles.tableHeader}>Tên tài sản</th>
          <th className={styles.tableHeader}>Mã tài sản</th>
          <th className={styles.tableHeader}>Trạng thái</th>
          <th className={styles.tableHeader}>Người giữ</th>
          <th className={styles.tableHeader}>Ngày bàn giao</th>
          <th className={styles.tableHeader}>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {assets.map(a => (
          <tr key={a.id}>
            <td>{a.asset_name}</td>
            <td>{a.asset_code || '-'}</td>
            <td>{a.status}</td>
            <td>{a.employee_name || 'Trong kho'}</td>
            <td>{formatDate(a.date_assigned)}</td>
            <td>
              {/* Dùng class "btn" chung */}
              <button 
                className="btn btn-warning" 
                onClick={() => handleEditClick(a)}>
                Sửa
              </button>
              <button 
                className="btn btn-danger" 
                onClick={() => handleDelete(a.id)}>
                Xóa
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AssetTable;