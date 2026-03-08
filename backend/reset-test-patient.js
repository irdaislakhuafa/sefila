const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🗑️  Menghapus semua data pasien test...\n');

    // Delete Mussa
    const mussaNIK = '3374012505950002';
    const mussaUser = await prisma.user.findUnique({ where: { nik: mussaNIK } });

    if (mussaUser) {
        await prisma.user.delete({ where: { id: mussaUser.id } });
        console.log('✅ Mussa dihapus');
    }

    // Delete Pasien Contoh yang lama
    const oldPatientNIK = '3374010101950001';
    const oldPatient = await prisma.user.findUnique({ where: { nik: oldPatientNIK } });

    if (oldPatient) {
        await prisma.user.delete({ where: { id: oldPatient.id } });
        console.log('✅ Pasien Contoh lama dihapus');
    }

    // Create NEW test patient with lab results
    console.log('\n👤 Membuat Pasien Uji Coba baru...');

    const testNIK = '3374010101950001';
    const testPassword = '01011995';
    const hashedPassword = await bcrypt.hash(testPassword, 10);

    const testPatient = await prisma.user.create({
        data: {
            nik: testNIK,
            email: 'ujicoba@example.com',
            password: hashedPassword,
            name: 'Pasien Uji Coba',
            birthDate: new Date('1995-01-01'),
            phoneNumber: '081234567890',
            role: 'PATIENT'
        }
    });

    console.log('✅ User created!');

    // Create registration
    console.log('\n📋 Membuat registrasi...');

    const registration = await prisma.pendaftaran.create({
        data: {
            userId: testPatient.id,
            nik: testNIK,
            nama: 'Pasien Uji Coba',
            tanggalLahir: new Date('1995-01-01'),
            alamat: 'Jl. Contoh No. 123, Kelurahan Bugangan',
            kelurahan: 'Bugangan',
            kecamatan: 'Semarang Timur',
            noTelepon: '081234567890',
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

    // Verify
    const verify = await prisma.user.findUnique({
        where: { nik: testNIK },
        include: {
            registrations: {
                include: {
                    hasilLab: true
                }
            }
        }
    });

    console.log('\n✅ DATA SIAP!');
    console.log('\n🔑 LOGIN CREDENTIALS:');
    console.log('   NIK:', testNIK);
    console.log('   Password:', testPassword);
    console.log('   Nama: Pasien Uji Coba');
    console.log('\n📊 Summary:');
    console.log('   - Pendaftaran:', verify.registrations.length);
    console.log('   - Hasil Lab:', verify.registrations[0]?.hasilLab ? 'Ada ✅' : 'Tidak ada ❌');
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
