const prisma = require('../config/database');

// Create new registration
const createRegistration = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            nik, nama, tanggalLahir, alamat, kelurahan, noTelepon,
            instansi,
            tidakHaid, tidakDouching, tidakBerhubungan, tidakHamil
        } = req.body;

        // Validation
        if (!nik || !nama || !tanggalLahir || !alamat || !kelurahan || !instansi) {
            return res.status(400).json({
                success: false,
                message: 'Data wajib tidak lengkap.'
            });
        }

        // Check if NIK already exists
        const existingRegistration = await prisma.pendaftaran.findUnique({
            where: { nik }
        });

        if (existingRegistration) {
            return res.status(400).json({
                success: false,
                message: 'NIK sudah terdaftar.'
            });
        }

        // Create registration
        const registration = await prisma.pendaftaran.create({
            data: {
                userId,
                nik,
                nama,
                tanggalLahir: new Date(tanggalLahir),
                alamat,
                kelurahan,
                noTelepon,
                instansi,
                tidakHaid: tidakHaid || false,
                tidakDouching: tidakDouching || false,
                tidakBerhubungan: tidakBerhubungan || false,
                tidakHamil: tidakHamil || false,
                status: 'PENDING'
            }
        });

        res.status(201).json({
            success: true,
            message: 'Pendaftaran berhasil! Silakan tunggu konfirmasi jadwal.',
            data: registration
        });
    } catch (error) {
        console.error('Create registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat pendaftaran.'
        });
    }
};

// Get all registrations (Admin only)
const getAllRegistrations = async (req, res) => {
    try {
        const { status, kelurahan, search } = req.query;

        const where = {};

        if (status) where.status = status;
        if (kelurahan) where.kelurahan = kelurahan;
        if (search) {
            where.OR = [
                { nama: { contains: search } },
                { nik: { contains: search } }
            ];
        }

        const registrations = await prisma.pendaftaran.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                hasilLab: true
            },
            orderBy: { tanggalDaftar: 'desc' }
        });

        res.json({
            success: true,
            data: registrations
        });
    } catch (error) {
        console.error('Get registrations error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan.'
        });
    }
};

// Get registration by ID
const getRegistrationById = async (req, res) => {
    try {
        const { id } = req.params;

        const registration = await prisma.pendaftaran.findUnique({
            where: { id: parseInt(id) },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                hasilLab: true
            }
        });

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: 'Pendaftaran tidak ditemukan.'
            });
        }

        // Check authorization
        if (req.user.role === 'PATIENT' && registration.userId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Akses ditolak.'
            });
        }

        res.json({
            success: true,
            data: registration
        });
    } catch (error) {
        console.error('Get registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan.'
        });
    }
};

// Get patient's own registrations
const getPatientRegistrations = async (req, res) => {
    try {
        const userId = req.user.id;

        const registrations = await prisma.pendaftaran.findMany({
            where: { userId },
            include: {
                hasilLab: true
            },
            orderBy: { tanggalDaftar: 'desc' }
        });

        res.json({
            success: true,
            data: registrations
        });
    } catch (error) {
        console.error('Get patient registrations error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan.'
        });
    }
};

// Update registration status (Admin only)
const updateRegistrationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, tanggalJadwal, tanggalPemeriksaan } = req.body;

        const updateData = {};
        if (status) updateData.status = status;
        if (tanggalJadwal) updateData.tanggalJadwal = new Date(tanggalJadwal);
        if (tanggalPemeriksaan) updateData.tanggalPemeriksaan = new Date(tanggalPemeriksaan);

        const registration = await prisma.pendaftaran.update({
            where: { id: parseInt(id) },
            data: updateData
        });

        res.json({
            success: true,
            message: 'Status pendaftaran berhasil diperbarui.',
            data: registration
        });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan.'
        });
    }
};

// Verify patient arrival (Admin only)
const verifyArrival = async (req, res) => {
    try {
        const { id } = req.params;

        const registration = await prisma.pendaftaran.findUnique({
            where: { id: parseInt(id) }
        });

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: 'Pendaftaran tidak ditemukan.'
            });
        }

        if (registration.status !== 'PENDING' && registration.status !== 'SCHEDULED') {
            return res.status(400).json({
                success: false,
                message: 'Status pendaftaran tidak valid untuk verifikasi kedatangan.'
            });
        }

        const updatedRegistration = await prisma.pendaftaran.update({
            where: { id: parseInt(id) },
            data: { status: 'ARRIVED' }
        });

        res.json({
            success: true,
            message: 'Kedatangan pasien berhasil diverifikasi.',
            data: updatedRegistration
        });
    } catch (error) {
        console.error('Verify arrival error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan.'
        });
    }
};

module.exports = {
    createRegistration,
    getAllRegistrations,
    getRegistrationById,
    getPatientRegistrations,
    updateRegistrationStatus,
    verifyArrival
};
