const db = require('../db');

// 1. Gửi yêu cầu mới (Dành cho Nhân viên)
exports.createRequest = async (req, res) => {
  try {
    const userId = req.user.userId; // Lấy từ token
    const { type, payload, note } = req.body; 

    // SỬA LẠI TÊN CỘT CHO KHỚP DATABASE: requester_id, request_type, approver_comment
    const sql = `INSERT INTO requests (requester_id, request_type, payload, approver_comment) VALUES (?, ?, ?, ?)`;
    
    // Lưu ý: 'note' của nhân viên tạm thời lưu vào approver_comment hoặc nên tạo cột riêng. 
    // Ở đây mình tạm lưu vào approver_comment để khớp bảng hiện tại.
    await db.query(sql, [userId, type || 'UPDATE_INFO', JSON.stringify(payload), note]);

    res.status(201).json({ message: 'Đã gửi yêu cầu thành công!' });
  } catch (err) {
    console.error("Lỗi gửi request:", err);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

// 2. Lấy danh sách yêu cầu (Dành cho Admin)
exports.getAllRequests = async (req, res) => {
  try {
    // SỬA JOIN ON r.requester_id
    const sql = `
      SELECT r.*, u.username, e.full_name, e.employee_code 
      FROM requests r
      JOIN users u ON r.requester_id = u.id
      LEFT JOIN employees e ON u.username = e.employee_code
      ORDER BY r.created_at DESC
    `;
    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    console.error("Lỗi lấy request:", err);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

// 3. Xử lý Duyệt/Từ chối (Dành cho Admin)
exports.processRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comment } = req.body; 

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
    }

    const [reqRows] = await db.query("SELECT * FROM requests WHERE id = ?", [id]);
    if (reqRows.length === 0) return res.status(404).json({ error: 'Không tìm thấy yêu cầu' });
    const request = reqRows[0];

    if (request.status !== 'PENDING') {
      return res.status(400).json({ error: 'Yêu cầu này đã được xử lý rồi.' });
    }

    // SỬA request.type THÀNH request.request_type
    if (status === 'APPROVED' && request.request_type === 'UPDATE_INFO') {
        // MySQL tự parse JSON, hoặc nếu lỗi thì dùng JSON.parse(request.payload)
        let dataToUpdate = request.payload;
        if (typeof dataToUpdate === 'string') {
            dataToUpdate = JSON.parse(dataToUpdate);
        }
        
        if (dataToUpdate.employee_id) {
             const empId = dataToUpdate.employee_id;
             delete dataToUpdate.employee_id;
             
             const keys = Object.keys(dataToUpdate);
             const values = Object.values(dataToUpdate);
             const setClause = keys.map(k => `${k} = ?`).join(', ');
             
             if (keys.length > 0) {
                await db.query(`UPDATE employees SET ${setClause} WHERE id = ?`, [...values, empId]);
             }
        }
    }

    // SỬA CẬP NHẬT approver_comment
    await db.query("UPDATE requests SET status = ?, approver_comment = ? WHERE id = ?", [status, comment, id]);

    res.json({ message: `Đã ${status === 'APPROVED' ? 'duyệt' : 'từ chối'} yêu cầu.` });

  } catch (err) {
    console.error("Lỗi xử lý request:", err);
    res.status(500).json({ error: 'Lỗi server' });
  }
};