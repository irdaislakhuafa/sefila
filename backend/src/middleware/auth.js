const jwt = require('jsonwebtoken');
const prisma = require('../config/database');

const auth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Akses ditolak. Token tidak ditemukan.'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
            }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User tidak ditemukan.'
            });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token tidak valid.'
        });
    }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({
            success: false,
            message: 'Akses ditolak. Hanya untuk admin.'
        });
    }
    next();
};

// Middleware to check if user is patient or accessing own data
const isPatientOrOwn = (req, res, next) => {
    const userId = parseInt(req.params.userId);

    if (req.user.role === 'ADMIN' || req.user.id === userId) {
        return next();
    }

    return res.status(403).json({
        success: false,
        message: 'Akses ditolak.'
    });
};

module.exports = { auth, isAdmin, isPatientOrOwn };
