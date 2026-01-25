const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deletePatientData() {
    try {
        console.log('🗑️  Menghapus data pasien...\n');

        // Delete HasilLab first (karena foreign key)
        const deletedHasilLab = await prisma.hasilLab.deleteMany();
        console.log(`✅ Deleted ${deletedHasilLab.count} hasil lab records`);

        // Delete Pendaftaran
        const deletedPendaftaran = await prisma.pendaftaran.deleteMany();
        console.log(`✅ Deleted ${deletedPendaftaran.count} pendaftaran records`);

        console.log('\n✅ Semua data pasien (registrations & hasil) berhasil dihapus!');
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

deletePatientData();
