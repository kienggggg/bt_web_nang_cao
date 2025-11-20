// hrm-backend/controllers/contract.controller.js
const db = require('../db');

// --- API HỢP ĐỒNG ---
// SỬA: Thêm c.attachment_url vào câu SELECT để Frontend có link mà hiển thị
const getContractsSql = `
    SELECT c.id, c.contract_code, c.contract_type, c.start_date, c.end_date, c.status, c.attachment_url,
           c.employee_id, e.full_name AS employee_name
    FROM contracts c
    JOIN employees e ON c.employee_id = e.id
`;

// GET /api/contracts (Search)
exports.getAllContracts = async (req, res) => {
    try {
        const { search } = req.query;
        let sql = getContractsSql;
        const params = [];
        if (search) {
            sql += " WHERE c.contract_code LIKE ? OR e.full_name LIKE ? OR c.contract_type LIKE ?";
            params.push(`%${search}%`);
            params.push(`%${search}%`);
            params.push(`%${search}%`);
        }
        sql += " ORDER BY c.id DESC";
        const [rows] = await db.query(sql, params);
        res.json(rows);
    } catch (err) {
        console.error("Lỗi [GET /api/contracts]:", err);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
};

// POST /api/contracts
exports.createContract = async (req, res) => {
    try {
        // req.body: dữ liệu text
        // req.file: file upload (nếu có)
        const { employee_id, contract_code, contract_type, start_date, end_date, status } = req.body;
        
        // Xử lý file upload
        const attachment_url = req.file ? `/uploads/${req.file.filename}` : null;

        if (!employee_id || !contract_code || !start_date || !end_date) {
            return res.status(400).json({ error: 'Nhân viên, Mã HĐ, Ngày bắt đầu và kết thúc là bắt buộc.' });
        }

        // SỬA: Thêm cột attachment_url vào câu lệnh INSERT
        const sql = `INSERT INTO contracts
                     (employee_id, contract_code, contract_type, start_date, end_date, status, attachment_url)
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;
                   
        const [result] = await db.query(sql, [
            employee_id, contract_code, contract_type, start_date, end_date, status, attachment_url
        ]);

        const [newContract] = await db.query(getContractsSql + " WHERE c.id = ?", [result.insertId]);
        res.status(201).json(newContract[0]);
    } catch (err) {
        console.error("Lỗi [POST /api/contracts]:", err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Mã hợp đồng này đã tồn tại.' });
        }
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
};

// PUT /api/contracts/:id
exports.updateContract = async (req, res) => {
    try {
        const { id } = req.params;
        const { employee_id, contract_code, contract_type, start_date, end_date, status } = req.body;

        // 1. Lấy thông tin cũ để giữ lại file nếu người dùng không upload file mới
        const [oldData] = await db.query("SELECT * FROM contracts WHERE id = ?", [id]);
        if (oldData.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy hợp đồng để cập nhật.' });
        }

        // 2. Xác định đường dẫn file (Mới hoặc Cũ)
        const attachment_url = req.file ? `/uploads/${req.file.filename}` : oldData[0].attachment_url;

        if (!employee_id || !contract_code || !start_date || !end_date) {
            return res.status(400).json({ error: 'Nhân viên, Mã HĐ, Ngày bắt đầu và Ngày kết thúc là bắt buộc.' });
        }

        // SỬA: Thêm attachment_url vào câu lệnh UPDATE
        const sql = `UPDATE contracts
                     SET
                       employee_id = ?, contract_code = ?, contract_type = ?,
                       start_date = ?, end_date = ?, status = ?, attachment_url = ?
                     WHERE id = ?`;

        await db.query(sql, [
            employee_id, contract_code, contract_type, start_date, end_date, status, attachment_url, id
        ]);

        const [updatedContract] = await db.query(getContractsSql + " WHERE c.id = ?", [id]);
        res.json(updatedContract[0]);
    } catch (err) {
        console.error("Lỗi [PUT /api/contracts/:id]:", err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Mã hợp đồng này đã bị trùng.' });
        }
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
};

// DELETE /api/contracts/:id
exports.deleteContract = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query("DELETE FROM contracts WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy hợp đồng để xóa.' });
        }
        res.status(204).send();
    } catch (err) {
        console.error("Lỗi [DELETE /api/contracts/:id]:", err);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
};

// (READ-BY-EMPLOYEE) Lấy hợp đồng theo ID nhân viên
exports.getContractsByEmployeeId = async (req, res) => {
  try {
    const { id } = req.params; 
    const sql = getContractsSql + " WHERE c.employee_id = ? ORDER BY c.start_date DESC";
    const [rows] = await db.query(sql, [id]);
    res.json(rows); 
  } catch (err) {
    console.error(`Lỗi [GET /api/employees/${req.params.id}/contracts]:`, err);
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};