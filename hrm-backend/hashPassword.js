const bcrypt = require('bcrypt');
const saltRounds = 10;

// Lấy mật khẩu từ dòng lệnh (ví dụ: node hashPassword.js admin123)
const plainPassword = process.argv[2]; 

if (!plainPassword) {
  console.log('Vui lòng cung cấp mật khẩu: node hashPassword.js <mat_khau_ban_muon>');
  process.exit(1);
}

bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
  if (err) {
    console.error('Lỗi khi hash mật khẩu:', err);
    return;
  }
  console.log('Mật khẩu của bạn:', plainPassword);
  console.log('---');
  console.log('MÃ HASH (Sao chép và dán vào CSDL):');
  console.log(hash);
});