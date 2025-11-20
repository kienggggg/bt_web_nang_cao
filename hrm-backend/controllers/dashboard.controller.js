// hrm-backend/controllers/dashboard.controller.js
const db = require('../db');

exports.getDashboardStats = async (req, res) => {
  try {
    // Chúng ta sẽ chạy song song 6 truy vấn CSDL
    const [
      [employeeResult],
      [contractResult],
      [trainingResult],
      [candidateResult],
      [attendanceResult]
    ] = await Promise.all([
      db.query("SELECT COUNT(*) as total FROM employees"),
      db.query("SELECT COUNT(*) as total FROM contracts WHERE status = 'Đang hiệu lực'"),
      db.query("SELECT COUNT(*) as total FROM training WHERE end_date >= CURDATE()"),
      db.query("SELECT COUNT(*) as total FROM candidates WHERE status = 'Mới'"),
      db.query("SELECT COUNT(*) as total FROM attendance WHERE date = CURDATE() AND status IN ('Vắng', 'Nghỉ ốm', 'Nghỉ phép')")
    ]);

    // Gộp kết quả
    const stats = {
      totalEmployees: employeeResult[0].total,
      activeContracts: contractResult[0].total,
      ongoingTrainings: trainingResult[0].total,
      newCandidates: candidateResult[0].total,
      absentToday: attendanceResult[0].total,
    };

    res.json(stats);

  } catch (err) {
    console.error("Lỗi [GET /api/dashboard/stats]:", err);
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ khi lấy thống kê' });
  }
};