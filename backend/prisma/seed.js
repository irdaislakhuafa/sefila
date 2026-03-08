const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Start seeding database...\n');

    // ========================================
    // SEED ADMIN USER
    // ========================================
    console.log('👤 Creating Admin User...');

    const adminNIK = 'admin';
    const adminPassword = 'admin123';

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
        where: { nik: adminNIK }
    });

    if (existingAdmin) {
        console.log('   ⚠️  Admin user already exists, updating password...');

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        await prisma.user.update({
            where: { nik: adminNIK },
            data: {
                password: hashedPassword,
                name: 'Admin SEFILA',
                email: 'admin@sefila.com'
            }
        });

        console.log('   ✅ Admin password updated!');
    } else {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        await prisma.user.create({
            data: {
                nik: adminNIK,
                email: 'admin@sefila.com',
                password: hashedPassword,
                name: 'Admin SEFILA',
                birthDate: new Date('1990-01-01'),
                phoneNumber: '081234567890',
                role: 'ADMIN'
            }
        });

        console.log('   ✅ Admin user created!');
    }

    console.log('\n📝 Admin Credentials:');
    console.log('   NIK:', adminNIK);
    console.log('   Password:', adminPassword);

    // ========================================
    // SEED SAMPLE PATIENT (OPTIONAL)
    // ========================================
    console.log('\n👥 Creating Sample Patient...');

    const samplePatientNIK = '3374010101950001';
    const samplePatientPassword = '01011995'; // Dari tanggal lahir: 01-01-1995

    const existingPatient = await prisma.user.findUnique({
        where: { nik: samplePatientNIK }
    });

    if (!existingPatient) {
        const hashedPatientPassword = await bcrypt.hash(samplePatientPassword, 10);

        const samplePatient = await prisma.user.create({
            data: {
                nik: samplePatientNIK,
                email: 'patient.sample@example.com',
                password: hashedPatientPassword,
                name: 'Pasien Contoh',
                birthDate: new Date('1995-01-01'),
                phoneNumber: '08123456789',
                role: 'PATIENT'
            }
        });

        console.log('   ✅ Sample patient created!');
        console.log('   NIK:', samplePatientNIK);
        console.log('   Password:', samplePatientPassword);

        // Create sample registration for this patient
        console.log('\n📋 Creating Sample Registration...');

        await prisma.pendaftaran.create({
            data: {
                userId: samplePatient.id,
                nik: samplePatientNIK,
                nama: 'Pasien Contoh',
                tanggalLahir: new Date('1995-01-01'),
                alamat: 'Jl. Contoh No. 123, Kelurahan Bugangan',
                kelurahan: 'Bugangan',
                kecamatan: 'Semarang Timur',
                noTelepon: '08123456789',
                instansi: 'Swasta',
                tidakHaid: true,
                tidakDouching: true,
                tidakBerhubungan: true,
                tidakHamil: true,
                status: 'PENDING',
                tanggalDaftar: new Date()
            }
        });

        console.log('   ✅ Sample registration created!');
    } else {
        console.log('   ⚠️  Sample patient already exists');
    }

    // ========================================
    // SEED PATIENT MUSSA WITH LAB RESULTS
    // ========================================
    console.log('\n👥 Creating Patient Mussa...');

    const mussaNIK = '3374012505950002';
    const mussaPassword = '25051995'; // Dari tanggal lahir: 25-05-1995

    const existingMussa = await prisma.user.findUnique({
        where: { nik: mussaNIK }
    });

    let mussaUser;
    if (!existingMussa) {
        const hashedMussaPassword = await bcrypt.hash(mussaPassword, 10);

        mussaUser = await prisma.user.create({
            data: {
                nik: mussaNIK,
                email: 'mussa@example.com',
                password: hashedMussaPassword,
                name: 'Mussa',
                birthDate: new Date('1995-05-25'),
                phoneNumber: '08123456788',
                role: 'PATIENT'
            }
        });

        console.log('   ✅ Patient Mussa created!');
        console.log('   NIK:', mussaNIK);
        console.log('   Password:', mussaPassword);

        // Create registration for Mussa
        console.log('\n📋 Creating Registration for Mussa...');

        const mussaRegistration = await prisma.pendaftaran.create({
            data: {
                userId: mussaUser.id,
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
                sudahDatang: true,
                tanggalDaftar: new Date('2026-01-20'),
                tanggalDatang: new Date('2026-01-22')
            }
        });

        console.log('   ✅ Registration for Mussa created!');

        // Create lab results for Mussa
        console.log('\n🔬 Creating Lab Results for Mussa...');

        await prisma.hasilLab.create({
            data: {
                pendaftaranId: mussaRegistration.id,
                hasilIVA: 'POSITIF',
                tindakLanjut: 'Rujuk ke RSUD untuk pemeriksaan lanjutan',
                keterangan: 'Ditemukan lesi pada serviks, perlu tindakan medis segera',
                tanggalPemeriksaan: new Date('2026-01-22')
            }
        });

        console.log('   ✅ Lab results for Mussa created!');
        console.log('   Hasil IVA: POSITIF');
        console.log('   Tindak Lanjut: Rujuk ke RSUD');
    } else {
        console.log('   ⚠️  Patient Mussa already exists');
    }

    console.log('\n✅ Seeding completed successfully!\n');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
