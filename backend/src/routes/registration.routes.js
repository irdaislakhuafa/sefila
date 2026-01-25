const express = require('express');
const router = express.Router();
const {
    createRegistration,
    getAllRegistrations,
    getRegistrationById,
    getPatientRegistrations,
    updateRegistrationStatus,
    verifyArrival
} = require('../controllers/registration.controller');
const { auth, isAdmin } = require('../middleware/auth');

// Patient routes
router.post('/', auth, createRegistration);
router.get('/my-registrations', auth, getPatientRegistrations);

// Admin routes
router.get('/', auth, isAdmin, getAllRegistrations);
router.get('/:id', auth, getRegistrationById);
router.patch('/:id/status', auth, isAdmin, updateRegistrationStatus);
router.patch('/:id/verify-arrival', auth, isAdmin, verifyArrival);

module.exports = router;

