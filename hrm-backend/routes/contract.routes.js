// hrm-backend/routes/employee.routes.js
const express = require('express');
const router = express.Router();

// Import controller tương ứng
const contractController = require('../controllers/contract.controller');
const authenticateToken = require('../middleware/auth.middleware');
router.use(authenticateToken);
// Định nghĩa các đường dẫn (endpoints)
// Lưu ý: '/' ở đây tương đương với '/api/contract' vì chúng ta sẽ lắp nó vào server.js
router.get('/', contractController.getAllContracts);
router.post('/', contractController.createContract);

// '/:id' ở đây tương đương với '/api/contract/:id'
router.put('/:id', contractController.updateContract);
router.delete('/:id', contractController.deleteContract);

// Xuất router này ra để server.js có thể dùng
module.exports = router;