// hrm-backend/routes/employee.routes.js
const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidate.controller');
const authenticateToken = require('../middleware/auth.middleware');
router.use(authenticateToken);
// Định nghĩa các routes cho ứng viênviên
// /api/candidate/
router.get('/', candidateController.getAllCandidates);
router.post('/', candidateController.createCandidate);

// /api/candidate/:id
router.put('/:id', candidateController.updateCandidate);
router.delete('/:id', candidateController.deleteCandidate);

module.exports = router;