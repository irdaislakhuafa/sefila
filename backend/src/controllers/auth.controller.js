const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');

// Register new patient
const register = async (req, res) => {
    try {
        const { nik, email, name, birthDate, phoneNumber } = req.body;

        // Validation
        if (!nik || !name || !birthDate) {
            return res.status(400).json({
                success: false,
                message: 'NIK, nama, dan tanggal lahir wajib diisi.'
            });
        }

        // Validate NIK format (16 digits)
        if (!/^\d{16}$/.test(nik)) {
            return res.status(400).json({
                success: false,
                message: 'NIK harus 16 digit angka.'
            });
        }

        // Check if NIK already exists
        const existingUserByNik = await prisma.user.findUnique({
            where: { nik }
        });

        if (existingUserByNik) {
            return res.status(400).json({
                success: false,
                message: 'NIK sudah terdaftar.'
            });
        }

        // Convert birthDate to Date object
        const birthDateObj = new Date(birthDate);

        // Generate password from birthDate (format: DDMMYYYY)
        const day = String(birthDateObj.getDate()).padStart(2, '0');
        const month = String(birthDateObj.getMonth() + 1).padStart(2, '0');
        const year = birthDateObj.getFullYear();
        const generatedPassword = `${day}${month}${year}`;

        // Hash password
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                nik,
                email,
                phoneNumber,
                password: hashedPassword,
                name,
                birthDate: birthDateObj,
                role: 'PATIENT'
            },
            select: {
                id: true,
                nik: true,
                email: true,
                name: true,
                birthDate: true,
                role: true,
                createdAt: true
            }
        });

        // Generate token
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(201).json({
            success: true,
            message: 'Registrasi berhasil! Password Anda adalah tanggal lahir dengan format DDMMYYYY.',
            data: { user, token }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat registrasi.'
        });
    }
};

// Login
const login = async (req, res) => {
    try {
        const { nik, password } = req.body;

        // Validation
        if (!nik || !password) {
            return res.status(400).json({
                success: false,
                message: 'NIK dan password wajib diisi.'
            });
        }

        // Find user by NIK
        const user = await prisma.user.findUnique({
            where: { nik }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'NIK atau password salah.'
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'NIK atau password salah. Password adalah tanggal lahir Anda (format: DDMMYYYY).'
            });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        // Return user data (without password)
        const { password: _, ...userWithoutPassword } = user;

        res.json({
            success: true,
            message: 'Login berhasil!',
            data: {
                user: userWithoutPassword,
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat login.'
        });
    }
};

// Get current user profile
const getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan.'
        });
    }
};

module.exports = { register, login, getProfile };
