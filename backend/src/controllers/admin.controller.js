const bcrypt = require('bcryptjs');
const prisma = require('../config/database');

// Create user by admin
const createUserByAdmin = async (req, res) => {
    try {
        const { nik, name, birthDate, email, phoneNumber } = req.body;

        // Validation
        if (!nik || !name || !birthDate) {
            return res.status(400).json({
                success: false,
                message: 'NIK, nama, dan tanggal lahir wajib diisi.'
            });
        }

        // Check if NIK already exists
        const existingUser = await prisma.user.findUnique({
            where: { nik }
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'NIK sudah terdaftar.'
            });
        }

        // Generate password from birthDate (format: DDMMYYYY)
        const birthDateObj = new Date(birthDate);
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
                name,
                birthDate: birthDateObj,
                email: email || null,
                phoneNumber: phoneNumber || null,
                password: hashedPassword,
                role: 'PATIENT'
            },
            select: {
                id: true,
                nik: true,
                name: true,
                email: true,
                phoneNumber: true,
                birthDate: true,
                role: true,
                createdAt: true
            }
        });

        res.status(201).json({
            success: true,
            message: 'User berhasil dibuat!',
            data: {
                user,
                password: generatedPassword,
                loginInstructions: `Login dengan NIK: ${nik} dan Password: ${generatedPassword}`
            }
        });
    } catch (error) {
        console.error('Create user by admin error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat membuat user.'
        });
    }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                nik: true,
                name: true,
                email: true,
                phoneNumber: true,
                birthDate: true,
                role: true,
                createdAt: true,
                updatedAt: true
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan.'
        });
    }
};

// Update user by admin
const updateUserByAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { nik, name, email, phoneNumber, birthDate } = req.body;

        const updateData = {};
        if (nik) updateData.nik = nik;
        if (name) updateData.name = name;
        if (email !== undefined) updateData.email = email || null;
        if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber || null;
        if (birthDate) {
            updateData.birthDate = new Date(birthDate);

            // Also update password if birthDate changes
            const birthDateObj = new Date(birthDate);
            const day = String(birthDateObj.getDate()).padStart(2, '0');
            const month = String(birthDateObj.getMonth() + 1).padStart(2, '0');
            const year = birthDateObj.getFullYear();
            const newPassword = `${day}${month}${year}`;
            updateData.password = await bcrypt.hash(newPassword, 10);
        }

        const user = await prisma.user.update({
            where: { id: parseInt(id) },
            data: updateData,
            select: {
                id: true,
                nik: true,
                name: true,
                email: true,
                phoneNumber: true,
                birthDate: true,
                role: true,
                updatedAt: true
            }
        });

        const response = {
            success: true,
            message: 'User berhasil diupdate.',
            data: { user }
        };

        // If password was updated, include new password in response
        if (birthDate) {
            const birthDateObj = new Date(birthDate);
            const day = String(birthDateObj.getDate()).padStart(2, '0');
            const month = String(birthDateObj.getMonth() + 1).padStart(2, '0');
            const year = birthDateObj.getFullYear();
            response.data.newPassword = `${day}${month}${year}`;
        }

        res.json(response);
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengupdate user.'
        });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.user.delete({
            where: { id: parseInt(id) }
        });

        res.json({
            success: true,
            message: 'User berhasil dihapus.'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat menghapus user.'
        });
    }
};

module.exports = {
    createUserByAdmin,
    getAllUsers,
    updateUserByAdmin,
    deleteUser
};
