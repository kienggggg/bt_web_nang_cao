// hrm-backend/routes/training.routes.js
const express = require('express');
const router = express.Router();
const trainingController = require('../controllers/training.controller');

// Định nghĩa các routes cho tuyển dụng
// /api/training/
router.get('/', trainingController.getAllTrainings);
router.post('/', trainingController.createTraining);

// /api/training/:id
router.put('/:id', trainingController.updateTraining);
router.delete('/:id', trainingController.deleteTraining);

module.exports = router;