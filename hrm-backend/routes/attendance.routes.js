// hrm-backend/routes/employee.routes.js
const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');

// Định nghĩa các routes cho Chấm công.
// /api/attendance/
router.get('/', attendanceController.getAllAttendances);
router.post('/', attendanceController.createAttendance);

// /api/attendance/:id
router.put('/:id', attendanceController.updateAttendance);
router.delete('/:id', attendanceController.deleteAttendance);

module.exports = router;