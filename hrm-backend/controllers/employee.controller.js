// hrm-backend/controllers/employee.controller.js
const db = require('../db');

// (READ) Lấy tất cả (có tìm kiếm)
exports.getAllEmployees = async (req, res) => {
  try {
    const { search } = req.query;
    let sql = "SELECT * FROM employees";
    const params = [];
    if (search) {
      sql += " WHERE full_name LIKE ? OR employee_code LIKE ? OR email LIKE ?";
      params.push(`%${search}%`);
      params.push(`%${search}%`);
      params.push(`%${search}%`);
    }
    sql += " ORDER BY id DESC";
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error("Lỗi [GET /api/employees]:", err);
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};

// (CREATE) Thêm mới
exports.createEmployee = async (req, res) => {
  try {
    const { employee_code, full_name, department, position, email, phone } = req.body;
    if (!employee_code || !full_name) {
      return res.status(400).json({ error: 'Mã nhân viên và Họ tên là bắt buộc.' });
    }
    const sql = `INSERT INTO employees
                (employee_code, full_name, department, position, email, phone)
                VALUES (?, ?, ?, ?, ?, ?)`;
    const [result] = await db.query(sql, [employee_code, full_name, department, position, email, phone]);
    const newEmployeeId = result.insertId;
    const [newEmployeeRows] = await db.query("SELECT * FROM employees WHERE id = ?", [newEmployeeId]);
    res.status(201).json(newEmployeeRows[0]);
  } catch (err) {
    console.error("Lỗi [POST /api/employees]:", err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Mã nhân viên này đã tồn tại.' });
    }
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};

// (UPDATE) Cập nhật
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { employee_code, full_name, department, position, email, phone } = req.body;
    if (!employee_code || !full_name) {
      return res.status(400).json({ error: 'Mã nhân viên và Họ tên là bắt buộc.' });
    }
    const sql = `UPDATE employees
                 SET
                   employee_code = ?, full_name = ?, department = ?,
                   position = ?, email = ?, phone = ?
                 WHERE id = ?`;
    const [result] = await db.query(sql, [employee_code, full_name, department, position, email, phone, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy nhân viên để cập nhật.' });
    }
    const [updatedEmployee] = await db.query("SELECT * FROM employees WHERE id = ?", [id]);
    res.json(updatedEmployee[0]);
  } catch (err) {
    console.error("Lỗi [PUT /api/employees/:id]:", err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Mã nhân viên này đã bị trùng.' });
    }
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};

// (DELETE) Xóa
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM employees WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy nhân viên để xóa.' });
    }
    res.status(204).send();
  } catch (err) {
    console.error("Lỗi [DELETE /api/employees/:id]:", err);
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ error: 'Không thể xóa nhân viên này. Họ đang có hợp đồng hoặc tài sản liên quan.' });
    }
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM employees WHERE id = ?", [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy nhân viên.' });
    }
    
    res.json(rows[0]); // Trả về 1 đối tượng, không phải mảng

  } catch (err) {
    console.error(`Lỗi [GET /api/employees/${req.params.id}]:`, err);
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};