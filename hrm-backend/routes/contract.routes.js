const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contract.controller');
const authenticateToken = require('../middleware/auth.middleware');
const multer = require('multer');
const path = require('path');

// Cấu hình nơi lưu file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.use(authenticateToken);

router.get('/', contractController.getAllContracts);

// Thêm 'file' vào upload.single. Tên field ở frontend gửi lên phải là 'contractFile'
router.post('/', upload.single('contractFile'), contractController.createContract);
router.put('/:id', upload.single('contractFile'), contractController.updateContract);
router.delete('/:id', contractController.deleteContract);
router.get('/:id/contracts', contractController.getContractsByEmployeeId); // Cái này của employee detail

module.exports = router;