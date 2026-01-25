const prisma = require('../config/database');

// Create lab result
const createLabResult = async (req, res) => {
    try {
        const {
            pendaftaranId,
            hasilIVA,
            jenisSpesimen,
            noSpesimen,
            tanggalPengambilan,
            subType16,
            subType18,
            subType52,
            subTypeLainnya,
            catatanDokter
        } = req.body;

        // Validation
        if (!pendaftaranId || !hasilIVA) {
            return res.status(400).json({
                success: false,
                message: 'Pendaftaran ID dan Hasil IVA wajib diisi.'
            });
        }

        // Check if registration exists and status is ARRIVED
        const registration = await prisma.pendaftaran.findUnique({
            where: { id: pendaftaranId }
        });

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: 'Pendaftaran tidak ditemukan.'
            });
        }

        if (registration.status !== 'ARRIVED') {
            return res.status(400).json({
                success: false,
                message: 'Pasien belum diverifikasi kedatangannya. Silakan verifikasi kedatangan terlebih dahulu.'
            });
        }

        // Check if lab result already exists
        const existingResult = await prisma.hasilLab.findUnique({
            where: { pendaftaranId }
        });

        if (existingResult) {
            return res.status(400).json({
                success: false,
                message: 'Hasil lab sudah ada untuk pendaftaran ini.'
            });
        }

        // Create lab result
        const labResult = await prisma.hasilLab.create({
            data: {
                pendaftaranId,
                hasilIVA: hasilIVA || 'NEGATIF',
                jenisSpesimen,
                noSpesimen,
                tanggalPengambilan: tanggalPengambilan ? new Date(tanggalPengambilan) : null,
                subType16,
                subType18,
                subType52,
                subTypeLainnya,
                catatanDokter
            }
        });

        // Update registration status to COMPLETED
        await prisma.pendaftaran.update({
            where: { id: pendaftaranId },
            data: {
                status: 'COMPLETED',
                tanggalPemeriksaan: new Date()
            }
        });

        res.status(201).json({
            success: true,
            message: 'Hasil lab berhasil disimpan.',
            data: labResult
        });
    } catch (error) {
        console.error('Create lab result error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat menyimpan hasil lab.'
        });
    }
};

// Get lab result by registration ID
const getLabResultByRegistration = async (req, res) => {
    try {
        const { registrationId } = req.params;

        const labResult = await prisma.hasilLab.findUnique({
            where: { pendaftaranId: parseInt(registrationId) },
            include: {
                pendaftaran: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        if (!labResult) {
            return res.status(404).json({
                success: false,
                message: 'Hasil lab tidak ditemukan.'
            });
        }

        // Check authorization
        if (req.user.role === 'PATIENT' && labResult.pendaftaran.userId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Akses ditolak.'
            });
        }

        res.json({
            success: true,
            data: labResult
        });
    } catch (error) {
        console.error('Get lab result error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan.'
        });
    }
};

// Update lab result
const updateLabResult = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            hasilIVA,
            jenisSpesimen,
            noSpesimen,
            tanggalPengambilan,
            subType16,
            subType18,
            subType52,
            subTypeLainnya,
            catatanDokter
        } = req.body;

        const labResult = await prisma.hasilLab.update({
            where: { id: parseInt(id) },
            data: {
                hasilIVA,
                jenisSpesimen,
                noSpesimen,
                tanggalPengambilan: tanggalPengambilan ? new Date(tanggalPengambilan) : undefined,
                subType16,
                subType18,
                subType52,
                subTypeLainnya,
                catatanDokter
            }
        });

        res.json({
            success: true,
            message: 'Hasil lab berhasil diperbarui.',
            data: labResult
        });
    } catch (error) {
        console.error('Update lab result error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan.'
        });
    }
};

// Get patient's lab results
const getPatientLabResults = async (req, res) => {
    try {
        const userId = req.user.id;

        const labResults = await prisma.hasilLab.findMany({
            where: {
                pendaftaran: {
                    userId
                }
            },
            include: {
                pendaftaran: true
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({
            success: true,
            data: labResults
        });
    } catch (error) {
        console.error('Get patient lab results error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan.'
        });
    }
};

module.exports = {
    createLabResult,
    getLabResultByRegistration,
    updateLabResult,
    getPatientLabResults
};
