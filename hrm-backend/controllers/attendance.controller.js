const db = require('../db');

// --- API CHẤM CÔNG (Giữ nguyên) ---
const getAttendanceSql = `
    SELECT att.id, att.date, att.status, att.notes,
           att.employee_id, e.full_name AS employee_name, e.employee_code
    FROM attendance att
    JOIN employees e ON att.employee_id = e.id
`;
// GET /api/attendance (Search)
exports.getAllAttendances = async (req, res) => {
    try {
        const { search } = req.query;
        let sql = getAttendanceSql;
        const params = [];
        if (search) {
            sql += " WHERE e.full_name LIKE ? OR e.employee_code LIKE ? OR att.status LIKE ?";
            params.push(`%${search}%`);
            params.push(`%${search}%`);
            params.push(`%${search}%`);
        }
        sql += " ORDER BY att.date DESC, e.full_name ASC";
        const [rows] = await db.query(sql, params);
        res.json(rows);
    } catch (err) {
        console.error("Lỗi [GET /api/attendance]:", err);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
};
// POST /api/attendance
exports.createAttendance = async (req, res) => {
    try {
        const { employee_id, date, status, notes } = req.body;
        if (!employee_id || !date || !status) {
            return res.status(400).json({ error: 'Nhân viên, Ngày và Trạng thái là bắt buộc.' });
        }
        const sql = `INSERT INTO attendance (employee_id, date, status, notes) VALUES (?, ?, ?, ?)`;
        const [result] = await db.query(sql, [employee_id, date, status, notes || null]);
        const [newAttendance] = await db.query(getAttendanceSql + " WHERE att.id = ?", [result.insertId]);
        res.status(201).json(newAttendance[0]);
    } catch (err) {
        console.error("Lỗi [POST /api/attendance]:", err);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
};
// PUT /api/attendance/:id
exports.updateAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const { employee_id, date, status, notes } = req.body;
        if (!employee_id || !date || !status) {
            return res.status(400).json({ error: 'Nhân viên, Ngày và Trạng thái là bắt buộc.' });
        }
        const sql = `UPDATE attendance SET employee_id = ?, date = ?, status = ?, notes = ? WHERE id = ?`;
        const [result] = await db.query(sql, [employee_id, date, status, notes || null, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy bản ghi chấm công để cập nhật.' });
        }
        const [updatedAttendance] = await db.query(getAttendanceSql + " WHERE att.id = ?", [id]);
        res.json(updatedAttendance[0]);
    } catch (err) {
        console.error("Lỗi [PUT /api/attendance/:id]:", err);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
};
// DELETE /api/attendance/:id
exports.deleteAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query("DELETE FROM attendance WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy bản ghi chấm công để xóa.' });
        }
        res.status(204).send();
    } catch (err) {
        console.error("Lỗi [DELETE /api/attendance/:id]:", err);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
};

exports.getAttendancesByEmployeeId = async (req, res) => {
  try {
    const { id } = req.params; // Đây là employee_id
    
    // Dùng lại biến getAttendanceSql
    // Lấy 100 bản ghi gần nhất
    const sql = getAttendanceSql + " WHERE att.employee_id = ? ORDER BY att.date DESC LIMIT 100";
    
    const [rows] = await db.query(sql, [id]);
    res.json(rows); // Trả về một mảng
  } catch (err) {
    console.error(`Lỗi [GET /api/employees/${req.params.id}/attendance]:`, err);
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};