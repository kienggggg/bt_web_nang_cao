import React from 'react';
import styles from './ContractTable.module.css';

function ContractTable({ contracts, handleEditClick, handleDelete, isAdmin }) {
  // ... (hàm formatDate giữ nguyên)
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '-';

  return (
    <table className="table">
      <thead>
        <tr>
          <th className={styles.tableHeader}>Mã HĐ</th>
          <th className={styles.tableHeader}>Tên nhân viên</th>
          <th className={styles.tableHeader}>Loại HĐ</th>
          <th className={styles.tableHeader}>Ngày hiệu lực</th>
          <th className={styles.tableHeader}>File HĐ</th> {/* Cột mới */}
          <th className={styles.tableHeader}>Trạng thái</th>
          {isAdmin && <th className={styles.tableHeader}>Hành động</th>}
        </tr>
      </thead>
      <tbody>
        {contracts.map(c => (
          <tr key={c.id}>
            <td>{c.contract_code}</td>
            <td>{c.employee_name}</td>
            <td>{c.contract_type}</td>
            <td>{formatDate(c.start_date)} - {formatDate(c.end_date)}</td>
            <td>
               {/* Link xem file */}
               {c.attachment_url ? (
                 <a 
                   href={`${process.env.REACT_APP_API_URL}${c.attachment_url}`} 
                   target="_blank" 
                   rel="noreferrer"
                   style={{color: '#004aad', textDecoration: 'underline', fontWeight: 'bold'}}
                 >
                   📄 Xem
                 </a>
               ) : <span style={{color: '#999'}}>Chưa có</span>}
            </td>
            <td>
                <span style={{
                    color: c.status === 'Đang hiệu lực' ? 'green' : 'red',
                    fontWeight: 'bold'
                }}>
                    {c.status}
                </span>
            </td>
            {isAdmin && (
              <td>
                <button className="btn btn-warning" onClick={() => handleEditClick(c)}>Sửa</button>
                <button className="btn btn-danger" onClick={() => handleDelete(c.id)}>Xóa</button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export default ContractTable;