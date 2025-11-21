import React from 'react';
import styles from './ContractTable.module.css';

function ContractTable({ contracts, handleEditClick, handleDelete }) {
  // 1. Lấy quyền Admin trực tiếp từ LocalStorage
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const isAdmin = user.role === 'ADMIN';

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '-';

  return (
    <table className="table">
      <thead>
        <tr>
          <th className={styles.tableHeader}>Mã HĐ</th>
          <th className={styles.tableHeader}>Tên nhân viên</th>
          <th className={styles.tableHeader}>Loại HĐ</th>
          <th className={styles.tableHeader}>Ngày hiệu lực</th>
          <th className={styles.tableHeader}>File HĐ</th>
          <th className={styles.tableHeader}>Trạng thái</th>
          {/* Chỉ hiện cột Hành động nếu là Admin */}
          {isAdmin && <th className={styles.tableHeader}>Hành động</th>}
        </tr>
      </thead>
      <tbody>
        {contracts.map(c => {
           // Logic kiểm tra hết hạn để đổi màu
           const isExpired = new Date(c.end_date) < new Date();
           const displayStatus = isExpired ? 'Đã hết hạn' : c.status;
           const statusColor = isExpired ? 'red' : (c.status === 'Đang hiệu lực' ? 'green' : 'black');

           return (
            <tr key={c.id}>
                <td>{c.contract_code}</td>
                <td>{c.employee_name}</td>
                <td>{c.contract_type}</td>
                <td>{formatDate(c.start_date)} - {formatDate(c.end_date)}</td>
                <td>
                {c.attachment_url ? (
                    <a 
                    href={`${process.env.REACT_APP_API_URL}${c.attachment_url}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    style={{color: '#004aad', fontWeight: 'bold', textDecoration: 'underline'}}
                    >
                    📄 Xem
                    </a>
                ) : <span style={{color: '#999', fontStyle: 'italic'}}>Chưa có</span>}
                </td>
                <td>
                    <span style={{ color: statusColor, fontWeight: 'bold' }}>
                        {displayStatus}
                    </span>
                </td>
                
                {/* Chỉ hiện nút nếu là Admin */}
                {isAdmin && (
                <td>
                    <button className="btn btn-warning" onClick={() => handleEditClick(c)}>Sửa</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(c.id)}>Xóa</button>
                </td>
                )}
            </tr>
           );
        })}
      </tbody>
    </table>
  );
}
export default ContractTable;