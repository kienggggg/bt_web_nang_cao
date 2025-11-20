const db = require('../db');

// --- API TUYỂN DỤNG (MỚI) ---

// SQL gốc để lấy ứng viên
const getCandidatesSql = `SELECT * FROM candidates`;
// 21. (READ) API LẤY ỨNG VIÊN (với TÌM KIẾM)
exports.getAllCandidates = async (req, res) => {
    try {
        const { search } = req.query;
        let sql = getCandidatesSql;
        const params = [];
        if (search) {
            // Tìm theo tên, email, vị trí, trạng thái
            sql += " WHERE full_name LIKE ? OR email LIKE ? OR position_applied LIKE ? OR status LIKE ?";
            params.push(`%${search}%`);
            params.push(`%${search}%`);
            params.push(`%${search}%`);
            params.push(`%${search}%`);
        }
        sql += " ORDER BY id DESC";
        const [rows] = await db.query(sql, params);
        res.json(rows);
    } catch (err) {
        console.error("Lỗi [GET /api/candidates]:", err);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
};

exports.createCandidate = async (req, res) => {
    try {
        // req.body chứa các text field
        // req.file chứa file upload (nếu có)
        const { full_name, email, phone, position_applied, status, interview_date } = req.body;
        
        // Lấy đường dẫn file nếu có upload
        const cv_url = req.file ? `/uploads/${req.file.filename}` : null;

        if (!full_name || !position_applied) {
            return res.status(400).json({ error: 'Họ tên và Vị trí ứng tuyển là bắt buộc.' });
        }

        const sql = `INSERT INTO candidates
                     (full_name, email, phone, position_applied, status, interview_date, cv_url)
                   VALUES (?, ?, ?, ?, ?, ?, ?)`; // Thêm cv_url

        const statusValue = status || 'Mới';
        const interviewDateValue = interview_date || null;

        const [result] = await db.query(sql, [
            full_name, email || null, phone || null, position_applied, statusValue, interviewDateValue, cv_url
        ]);

        const [newCandidate] = await db.query("SELECT * FROM candidates WHERE id = ?", [result.insertId]);
        res.status(201).json(newCandidate[0]);
    } catch (err) {
        console.error("Lỗi [POST /api/candidates]:", err);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
};

// (UPDATE) API CẬP NHẬT
exports.updateCandidate = async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, email, phone, position_applied, status, interview_date } = req.body;
        
        // Logic: Nếu có upload file mới thì dùng đường dẫn mới, không thì giữ nguyên (hoặc xử lý tùy ý)
        // Ở đây ta cần cẩn thận: Nếu client không gửi file, ta không được set cv_url = null (mất file cũ)
        // Do đó, update SQL cần linh động hơn.
        
        // Cách đơn giản nhất cho sinh viên: 
        // 1. Lấy dữ liệu cũ
        const [oldData] = await db.query("SELECT * FROM candidates WHERE id = ?", [id]);
        if (oldData.length === 0) return res.status(404).json({ error: 'Không tìm thấy' });
        
        // 2. Xác định cv_url mới
        const cv_url = req.file ? `/uploads/${req.file.filename}` : oldData[0].cv_url;

        const sql = `UPDATE candidates
                     SET full_name = ?, email = ?, phone = ?, position_applied = ?, status = ?, interview_date = ?, cv_url = ?
                     WHERE id = ?`;

        const statusValue = status || 'Mới';
        const interviewDateValue = interview_date || null;

        await db.query(sql, [
            full_name, email || null, phone || null, position_applied, statusValue, interviewDateValue, cv_url, id
        ]);

        const [updatedCandidate] = await db.query("SELECT * FROM candidates WHERE id = ?", [id]);
        res.json(updatedCandidate[0]);
    } catch (err) {
        console.error("Lỗi [PUT /api/candidates/:id]:", err);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
};

// 24. (DELETE) API XÓA ỨNG VIÊN
exports.deleteCandidate = async (req, res) => {
    try {
        const { id } = req.params;
        // Có thể thêm logic xóa file CV liên quan ở đây nếu cần
        const [result] = await db.query("DELETE FROM candidates WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy ứng viên để xóa.' });
        }
        res.status(204).send(); // Xóa thành công
    } catch (err) {
        console.error("Lỗi [DELETE /api/candidates/:id]:", err);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
};

