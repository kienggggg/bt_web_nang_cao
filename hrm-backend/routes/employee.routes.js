// hrm-backend/routes/employee.routes.js
const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');
const contractController = require('../controllers/contract.controller');
const assetController = require('../controllers/asset.controller');
const trainingController = require('../controllers/training.controller');
const attendanceController = require('../controllers/attendance.controller');
const authenticateToken = require('../middleware/auth.middleware');
router.use(authenticateToken);
// Định nghĩa các routes cho Nhân sự
// /api/employees/
router.get('/', employeeController.getAllEmployees);
router.post('/', employeeController.createEmployee);
// /api/employees/:id
router.get('/:id', employeeController.getEmployeeById);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

// GET /api/employees/:id/contracts
router.get('/:id/contracts', contractController.getContractsByEmployeeId);

// GET /api/employees/:id/assets
router.get('/:id/assets', assetController.getAssetsByEmployeeId);

// GET /api/employees/:id/training
router.get('/:id/training', trainingController.getTrainingsByEmployeeId);

// GET /api/employees/:id/attendance
router.get('/:id/attendance', attendanceController.getAttendancesByEmployeeId);
module.exports = router;