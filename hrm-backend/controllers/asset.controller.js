const db = require('../db');

// --- API TÀI SẢN (Giữ nguyên) ---
const getAssetsSql = `
    SELECT a.id, a.asset_name, a.asset_code, a.date_assigned, a.status,
           a.employee_id, e.full_name AS employee_name
    FROM assets a
    LEFT JOIN employees e ON a.employee_id = e.id
`;
// GET /api/assets (Search)
exports.getAllAssets = async (req, res) => {
    try {
        const { search } = req.query;
        let sql = getAssetsSql;
        const params = [];
        if (search) {
            sql += " WHERE a.asset_name LIKE ? OR a.asset_code LIKE ? OR e.full_name LIKE ? OR a.status LIKE ?";
            params.push(`%${search}%`);
            params.push(`%${search}%`);
            params.push(`%${search}%`);
            params.push(`%${search}%`);
        }
        sql += " ORDER BY a.id DESC";
        const [rows] = await db.query(sql, params);
        res.json(rows);
    } catch (err) {
        console.error("Lỗi [GET /api/assets]:", err);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
};
// POST /api/assets
exports.createAsset = async (req, res) => {
    try {
        const { asset_name, asset_code, date_assigned, status, employee_id } = req.body;
        if (!asset_name || !status) {
            return res.status(400).json({ error: 'Tên tài sản và Trạng thái là bắt buộc.' });
        }
        if (employee_id && !date_assigned) {
             return res.status(400).json({ error: 'Ngày bàn giao là bắt buộc khi gán tài sản cho nhân viên.' });
        }
        const sql = `INSERT INTO assets (asset_name, asset_code, date_assigned, status, employee_id)
                   VALUES (?, ?, ?, ?, ?)`;
        const employeeIdValue = employee_id ? parseInt(employee_id, 10) : null;
        const dateAssignedValue = employeeIdValue ? date_assigned : null;
        const [result] = await db.query(sql, [asset_name, asset_code || null, dateAssignedValue, status, employeeIdValue]);
        const [newAsset] = await db.query(getAssetsSql + " WHERE a.id = ?", [result.insertId]);
        res.status(201).json(newAsset[0]);
    } catch (err) {
        console.error("Lỗi [POST /api/assets]:", err);
         if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Mã tài sản này đã tồn tại.' });
        }
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
};
// PUT /api/assets/:id
exports.updateAsset = async (req, res) => {
    try {
        const { id } = req.params;
        const { asset_name, asset_code, date_assigned, status, employee_id } = req.body;
         if (!asset_name || !status) {
            return res.status(400).json({ error: 'Tên tài sản và Trạng thái là bắt buộc.' });
        }
        if (employee_id && !date_assigned) {
             return res.status(400).json({ error: 'Ngày bàn giao là bắt buộc khi gán tài sản cho nhân viên.' });
        }
        const sql = `UPDATE assets SET asset_name = ?, asset_code = ?, date_assigned = ?, status = ?, employee_id = ? WHERE id = ?`;
        const employeeIdValue = employee_id ? parseInt(employee_id, 10) : null;
        const dateAssignedValue = employeeIdValue ? date_assigned : null;
        const [result] = await db.query(sql, [asset_name, asset_code || null, dateAssignedValue, status, employeeIdValue, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy tài sản để cập nhật.' });
        }
        const [updatedAsset] = await db.query(getAssetsSql + " WHERE a.id = ?", [id]);
        res.json(updatedAsset[0]);
    } catch (err) {
        console.error("Lỗi [PUT /api/assets/:id]:", err);
         if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Mã tài sản này đã bị trùng.' });
        }
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
};
// DELETE /api/assets/:id
exports.deleteAsset = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query("DELETE FROM assets WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy tài sản để xóa.' });
        }
        res.status(204).send();
    } catch (err) {
        console.error("Lỗi [DELETE /api/assets/:id]:", err);
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
             return res.status(400).json({ error: 'Không thể xóa tài sản này (có thể liên quan đến bản ghi khác).' });
        }
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
};
// (READ-BY-EMPLOYEE) Lấy tài sản theo ID nhân viên
exports.getAssetsByEmployeeId = async (req, res) => {
  try {
    const { id } = req.params; // Đây là employee_id
    
    // Dùng lại biến getAssetsSql
    const sql = getAssetsSql + " WHERE a.employee_id = ? ORDER BY a.date_assigned DESC";
    
    const [rows] = await db.query(sql, [id]);
    res.json(rows);
  } catch (err) {
    console.error(`Lỗi [GET /api/employees/${req.params.id}/assets]:`, err);
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};