const express = require('express');
const router = express.Router();
const {
    createUserByAdmin,
    getAllUsers,
    updateUserByAdmin,
    deleteUser
} = require('../controllers/admin.controller');
const { auth } = require('../middleware/auth');

// Middleware to check if user is admin
const adminOnly = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({
            success: false,
            message: 'Akses ditolak. Hanya admin yang dapat mengakses.'
        });
    }
    next();
};

// All routes require authentication and admin role
router.use(auth, adminOnly);

// User management routes
router.post('/users', createUserByAdmin);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUserByAdmin);
router.delete('/users/:id', deleteUser);

module.exports = router;
