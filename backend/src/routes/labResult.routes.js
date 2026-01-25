const express = require('express');
const router = express.Router();
const {
    createLabResult,
    getLabResultByRegistration,
    updateLabResult,
    getPatientLabResults
} = require('../controllers/labResult.controller');
const { auth, isAdmin } = require('../middleware/auth');

// Patient routes
router.get('/my-results', auth, getPatientLabResults);
router.get('/registration/:registrationId', auth, getLabResultByRegistration);

// Admin routes
router.post('/', auth, isAdmin, createLabResult);
router.put('/:id', auth, isAdmin, updateLabResult);

module.exports = router;
