const prisma = require('../config/database');

// Get dashboard statistics for admin
const getDashboardStats = async (req, res) => {
    try {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Total registrations this month
        const totalThisMonth = await prisma.pendaftaran.count({
            where: {
                tanggalDaftar: {
                    gte: firstDayOfMonth
                }
            }
        });

        // Pending registrations
        const pending = await prisma.pendaftaran.count({
            where: { status: 'PENDING' }
        });

        // Scheduled registrations
        const scheduled = await prisma.pendaftaran.count({
            where: { status: 'SCHEDULED' }
        });

        // Completed examinations
        const completed = await prisma.pendaftaran.count({
            where: { status: 'COMPLETED' }
        });

        // Total patients (unique users with registrations)
        const totalPatients = await prisma.user.count({
            where: { role: 'PATIENT' }
        });

        res.json({
            success: true,
            data: {
                totalThisMonth,
                pending,
                scheduled,
                completed,
                totalPatients
            }
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan.'
        });
    }
};

// Get patient distribution by kelurahan (for map)
const getPatientDistribution = async (req, res) => {
    try {
        const registrations = await prisma.pendaftaran.findMany({
            select: {
                id: true,
                nama: true,
                kelurahan: true,
                kecamatan: true,
                alamat: true,
                status: true,
                tanggalDaftar: true
            }
        });

        // Group by kelurahan
        const distribution = registrations.reduce((acc, reg) => {
            const key = `${reg.kelurahan}, ${reg.kecamatan}`;

            if (!acc[key]) {
                acc[key] = {
                    kelurahan: reg.kelurahan,
                    kecamatan: reg.kecamatan,
                    total: 0,
                    pending: 0,
                    scheduled: 0,
                    completed: 0,
                    patients: []
                };
            }

            acc[key].total += 1;
            acc[key][reg.status.toLowerCase()] = (acc[key][reg.status.toLowerCase()] || 0) + 1;
            acc[key].patients.push({
                id: reg.id,
                nama: reg.nama,
                alamat: reg.alamat,
                status: reg.status,
                tanggalDaftar: reg.tanggalDaftar
            });

            return acc;
        }, {});

        res.json({
            success: true,
            data: Object.values(distribution)
        });
    } catch (error) {
        console.error('Get patient distribution error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan.'
        });
    }
};

// Get monthly trends
const getMonthlyTrends = async (req, res) => {
    try {
        const { year } = req.query;
        const targetYear = year ? parseInt(year) : new Date().getFullYear();

        const registrations = await prisma.pendaftaran.findMany({
            where: {
                tanggalDaftar: {
                    gte: new Date(targetYear, 0, 1),
                    lt: new Date(targetYear + 1, 0, 1)
                }
            },
            select: {
                tanggalDaftar: true,
                status: true
            }
        });

        // Group by month
        const monthlyData = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            total: 0,
            pending: 0,
            scheduled: 0,
            completed: 0
        }));

        registrations.forEach(reg => {
            const month = reg.tanggalDaftar.getMonth();
            monthlyData[month].total += 1;
            monthlyData[month][reg.status.toLowerCase()] =
                (monthlyData[month][reg.status.toLowerCase()] || 0) + 1;
        });

        res.json({
            success: true,
            data: monthlyData
        });
    } catch (error) {
        console.error('Get monthly trends error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan.'
        });
    }
};

// Get kelurahan statistics with percentages
const getKelurahanStats = async (req, res) => {
    try {
        // Get all registrations grouped by kelurahan
        const registrations = await prisma.pendaftaran.groupBy({
            by: ['kelurahan'],
            _count: {
                id: true
            },
            orderBy: {
                _count: {
                    id: 'desc'
                }
            }
        });

        // Get total count for percentage calculation
        const total = registrations.reduce((sum, item) => sum + item._count.id, 0);

        // Calculate percentage for each kelurahan
        const kelurahanStats = registrations.map(item => ({
            kelurahan: item.kelurahan,
            count: item._count.id,
            percentage: total > 0 ? Math.round((item._count.id / total) * 100 * 10) / 10 : 0
        }));

        res.json({
            success: true,
            data: {
                total,
                kelurahanStats
            }
        });
    } catch (error) {
        console.error('Get kelurahan stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan.'
        });
    }
};

module.exports = {
    getDashboardStats,
    getPatientDistribution,
    getMonthlyTrends,
    getKelurahanStats
};
