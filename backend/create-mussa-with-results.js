const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('👤 Membuat data Mussa dengan hasil lab...\n');

    const mussaNIK = '3374012505950002';
    const mussaPassword = '25051995';

    // Delete if exists
    const existing = await prisma.user.findUnique({ where: { nik: mussaNIK } });
    if (existing) {
        await prisma.user.delete({ where: { id: existing.id } });
        console.log('🗑️  Mussa lama dihapus');
    }

    // Create Mussa
    console.log('👤 Membuat user Mussa...');
    const hashedPassword = await bcrypt.hash(mussaPassword, 10);

    const mussa = await prisma.user.create({
        data: {
            nik: mussaNIK,
            email: 'mussa@example.com',
            password: hashedPassword,
            name: 'Mussa',
            birthDate: new Date('1995-05-25'),
            phoneNumber: '08123456788',
            role: 'PATIENT'
        }
    });
    console.log('✅ User Mussa created!');

    // Create registration
    console.log('\n📋 Membuat registrasi...');
    const registration = await prisma.pendaftaran.create({
        data: {
            userId: mussa.id,
            nik: mussaNIK,
            nama: 'Mussa',
            tanggalLahir: new Date('1995-05-25'),
            alamat: 'Jl. Pemuda No. 45, Kelurahan Gabahan',
            kelurahan: 'Gabahan',
            kecamatan: 'Semarang Timur',
            noTelepon: '08123456788',
            instansi: 'Swasta',
            tidakHaid: true,
            tidakDouching: true,
            tidakBerhubungan: true,
            tidakHamil: true,
            status: 'COMPLETED',
            tanggalDaftar: new Date('2026-01-20'),
            tanggalPemeriksaan: new Date('2026-01-22')
        }
    });
    console.log('✅ Registrasi created!');

    // Create lab result
    console.log('\n🔬 Membuat hasil lab...');
    await prisma.hasilLab.create({
        data: {
            pendaftaranId: registration.id,
            hasilIVA: 'POSITIF',
            tindakLanjut: 'Rujuk ke RSUD untuk pemeriksaan lanjutan',
            keterangan: 'Ditemukan lesi pada serviks, perlu tindakan medis segera',
            tanggalPemeriksaan: new Date('2026-01-22'),
            catatanDokter: 'Pasien perlu segera dirujuk untuk pemeriksaan lanjutan'
        }
    });
    console.log('✅ Hasil lab created!');

    console.log('\n✅ DATA MUSSA SIAP!\n');
    console.log('🔑 LOGIN CREDENTIALS:');
    console.log('   NIK: ' + mussaNIK);
    console.log('   Password: ' + mussaPassword);
    console.log('   Nama: Mussa');
    console.log('\n📍 Login di: http://localhost:5173/login');
    console.log('   atau: http://103.172.204.50:5173/login');
    console.log('\n');
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
