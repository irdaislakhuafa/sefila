const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getPatientDistribution,
    getMonthlyTrends,
    getKelurahanStats
} = require('../controllers/stats.controller');
const { auth, isAdmin } = require('../middleware/auth');

// Public routes (no auth required)
router.get('/kelurahan-public', getKelurahanStats);

// Admin only routes
router.get('/dashboard', auth, isAdmin, getDashboardStats);
router.get('/distribution', auth, isAdmin, getPatientDistribution);
router.get('/monthly-trends', auth, isAdmin, getMonthlyTrends);
router.get('/kelurahan', auth, isAdmin, getKelurahanStats);

module.exports = router;

