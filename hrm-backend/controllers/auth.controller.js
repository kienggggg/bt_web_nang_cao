const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ! RẤT QUAN TRỌNG: 
// Trong dự án thật, hãy giấu khóa này vào file .env
// Đừng bao giờ để lộ khóa này công khai.
const JWT_SECRET = process.env.JWT_SECRET || 'chuoi_bi_mat_du_phong_cho_local';

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Vui lòng nhập tên đăng nhập và mật khẩu.' });
    }

    // 1. Tìm người dùng
    const [userRows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    if (userRows.length === 0) {
      // (Bảo mật: Không nên nói "Tên đăng nhập không tồn tại")
      return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
    }
    const user = userRows[0];

    // 2. So sánh mật khẩu (dùng mật khẩu hash mới)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
    }

    // 3. Tạo Token (JWT)
    const payload = {
      userId: user.id,
      username: user.username,
      role: user.role_id // Lấy vai trò từ CSDL
    };
    
    // Tạo token có hạn 1 ngày
    const token = jwt.sign(
      payload, 
      JWT_SECRET, 
      { expiresIn: '1d' } 
    );

    // 4. Trả về token cho client
    res.json({
      message: 'Đăng nhập thành công!',
      token: token,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Lỗi [POST /api/auth/login]:", err);
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.userId; // Lấy ID từ Token (nhờ middleware)

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Vui lòng nhập đầy đủ thông tin.' });
    }

    // 1. Lấy thông tin user từ DB để lấy mật khẩu mã hóa hiện tại
    const [users] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
    if (users.length === 0) return res.status(404).json({ error: 'User không tồn tại.' });
    
    const currentUser = users[0];

    // 2. Kiểm tra mật khẩu cũ có đúng không
    const isMatch = await bcrypt.compare(oldPassword, currentUser.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Mật khẩu cũ không chính xác.' });
    }

    // 3. Mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 4. Cập nhật vào DB
    await db.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, userId]);

    res.json({ message: 'Đổi mật khẩu thành công!' });

  } catch (err) {
    console.error("Lỗi đổi mật khẩu:", err); //test push
    res.status(500).json({ error: 'Lỗi server.' });
  }
};