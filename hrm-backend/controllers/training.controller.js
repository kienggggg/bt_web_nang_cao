const db = require('../db');

// --- API ĐÀO TẠO (Giữ nguyên) ---
const getTrainingSql = `
    SELECT t.id, t.course_name, t.trainer_name, t.start_date, t.end_date, t.score,
           t.employee_id, e.full_name AS employee_name, e.employee_code
    FROM training t
    JOIN employees e ON t.employee_id = e.id
`;
// GET /api/training (Search)
exports.getAllTrainings = async (req, res) => {
    try {
        const { search } = req.query;
        let sql = getTrainingSql;
        const params = [];
        if (search) {
            sql += " WHERE t.course_name LIKE ? OR e.full_name LIKE ? OR t.trainer_name LIKE ?";
            params.push(`%${search}%`);
            params.push(`%${search}%`);
            params.push(`%${search}%`);
        }
        sql += " ORDER BY t.id DESC";
        const [rows] = await db.query(sql, params);
        res.json(rows);
    } catch (err) {
        console.error("Lỗi [GET /api/training]:", err);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
};
// POST /api/training
exports.createTraining = async (req, res) => {
    try {
        const { employee_id, course_name, trainer_name, start_date, end_date, score } = req.body;
        if (!employee_id || !course_name || !start_date || !end_date) {
            return res.status(400).json({ error: 'Nhân viên, Tên khóa học, Ngày bắt đầu và kết thúc là bắt buộc.' });
        }
        const scoreValue = score ? parseInt(score, 10) : null;
        if (scoreValue !== null && (isNaN(scoreValue) || scoreValue < 0 || scoreValue > 100)) {
            return res.status(400).json({ error: 'Điểm đánh giá phải là số từ 0 đến 100.' });
        }
        const sql = `INSERT INTO training
                     (employee_id, course_name, trainer_name, start_date, end_date, score)
                   VALUES (?, ?, ?, ?, ?, ?)`;
        const [result] = await db.query(sql, [employee_id, course_name, trainer_name, start_date, end_date, scoreValue]);
        const [newTraining] = await db.query(getTrainingSql + " WHERE t.id = ?", [result.insertId]);
        res.status(201).json(newTraining[0]);
    } catch (err) {
        console.error("Lỗi [POST /api/training]:", err);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
};
// PUT /api/training/:id
exports.updateTraining = async (req, res) => {
    try {
        const { id } = req.params;
        const { employee_id, course_name, trainer_name, start_date, end_date, score } = req.body;
        if (!employee_id || !course_name || !start_date || !end_date) {
            return res.status(400).json({ error: 'Nhân viên, Tên khóa học, Ngày bắt đầu và kết thúc là bắt buộc.' });
        }
        const scoreValue = score ? parseInt(score, 10) : null;
        if (scoreValue !== null && (isNaN(scoreValue) || scoreValue < 0 || scoreValue > 100)) {
            return res.status(400).json({ error: 'Điểm đánh giá phải là số từ 0 đến 100.' });
        }
        const sql = `UPDATE training
                     SET
                       employee_id = ?, course_name = ?, trainer_name = ?,
                       start_date = ?, end_date = ?, score = ?
                     WHERE id = ?`;
        const [result] = await db.query(sql, [employee_id, course_name, trainer_name, start_date, end_date, scoreValue, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy khóa đào tạo để cập nhật.' });
        }
        const [updatedTraining] = await db.query(getTrainingSql + " WHERE t.id = ?", [id]);
        res.json(updatedTraining[0]);
    } catch (err) {
        console.error("Lỗi [PUT /api/training/:id]:", err);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
};
// DELETE /api/training/:id
exports.deleteTraining = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query("DELETE FROM training WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy khóa đào tạo để xóa.' });
        }
        res.status(204).send();
    } catch (err) {
        console.error("Lỗi [DELETE /api/training/:id]:", err);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
};

exports.getTrainingsByEmployeeId = async (req, res) => {
  try {
    const { id } = req.params; // Đây là employee_id
    
    // Dùng lại biến getTrainingSql
    const sql = getTrainingSql + " WHERE t.employee_id = ? ORDER BY t.start_date DESC";
    
    const [rows] = await db.query(sql, [id]);
    res.json(rows); // Trả về một mảng
  } catch (err) {
    console.error(`Lỗi [GET /api/employees/${req.params.id}/training]:`, err);
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};