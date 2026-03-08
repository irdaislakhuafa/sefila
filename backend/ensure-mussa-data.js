const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Checking Mussa data...\n');

    const mussaNIK = '3374012505950002';
    const mussaPassword = '25051995';

    // Check if Mussa exists
    let mussaUser = await prisma.user.findUnique({
        where: { nik: mussaNIK },
        include: {
            registrations: {
                include: {
                    hasilLab: true
                }
            }
        }
    });

    if (mussaUser) {
        console.log('✅ User Mussa ditemukan:');
        console.log(`   - ID: ${mussaUser.id}`);
        console.log(`   - Nama: ${mussaUser.name}`);
        console.log(`   - NIK: ${mussaUser.nik}`);
        console.log(`   - Email: ${mussaUser.email}`);
        console.log(`   - Jumlah Pendaftaran: ${mussaUser.registrations.length}`);

        if (mussaUser.registrations.length > 0) {
            mussaUser.registrations.forEach((reg, i) => {
                console.log(`\n   Pendaftaran #${i + 1}:`);
                console.log(`     - ID: ${reg.id}`);
                console.log(`     - Status: ${reg.status}`);
                console.log(`     - Hasil Lab: ${reg.hasilLab ? 'Ada' : 'Tidak ada'}`);

                if (reg.hasilLab) {
                    // Assuming hasilLab is now a single object directly on registration,
                    // or we are just checking for existence of *any* lab result.
                    // If it's an array, this part needs further adjustment.
                    // For now, following the instruction's output format.
                    console.log(`       Hasil IVA: ${reg.hasilLab.hasilIVA}`);
                    console.log(`       Catatan: ${reg.hasilLab.keterangan || '-'}`); // Changed 'catatanDokter' to 'keterangan' based on schema
                } else {
                    console.log('       ⚠️  Tidak ada hasil lab!');
                }
            });
        } else {
            console.log('   ⚠️  Tidak ada pendaftaran!');
        }

        // Delete Mussa and recreate with lab results
        console.log('\n🗑️  Menghapus data Mussa yang lama...');

        // Delete lab results first
        await prisma.hasilLab.deleteMany({
            where: {
                pendaftaran: {
                    userId: mussaUser.id
                }
            }
        });

        // Delete pendaftaran
        await prisma.pendaftaran.deleteMany({
            where: { userId: mussaUser.id }
        });

        // Delete user
        await prisma.user.delete({
            where: { id: mussaUser.id }
        });

        console.log('   ✅ Data lama dihapus!');
    } else {
        console.log('ℹ️  User Mussa belum ada, akan dibuat baru');
    }

    // Create new Mussa with lab results
    console.log('\n👤 Membuat user Mussa baru...');

    const hashedPassword = await bcrypt.hash(mussaPassword, 10);

    mussaUser = await prisma.user.create({
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
    console.log(`   - ID: ${mussaUser.id}`);

    // Create registration
    console.log('\n📋 Membuat registrasi untuk Mussa...');

    const registration = await prisma.pendaftaran.create({
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
            tanggalDaftar: new Date('2026-01-20'),
            tanggalPemeriksaan: new Date('2026-01-22')
        }
    });

    console.log('✅ Registrasi created!');
    console.log(`   - ID: ${registration.id}`);

    // Create lab result
    console.log('\n🔬 Membuat hasil lab untuk Mussa...');

    const labResult = await prisma.hasilLab.create({
        data: {
            pendaftaranId: registration.id,
            hasilIVA: 'POSITIF',
            tindakLanjut: 'Rujuk ke RSUD untuk pemeriksaan lanjutan',
            keterangan: 'Ditemukan lesi pada serviks, perlu tindakan medis segera',
            tanggalPemeriksaan: new Date('2026-01-22')
        }
    });

    console.log('✅ Hasil lab created!');
    console.log(`   - ID: ${labResult.id}`);
    console.log(`   - Hasil IVA: ${labResult.hasilIVA}`);

    // Verify the data
    console.log('\n✅ VERIFIKASI DATA FINAL:');
    const finalCheck = await prisma.user.findUnique({
        where: { nik: mussaNIK },
        include: {
            registrations: {
                include: {
                    hasilLab: true
                }
            }
        }
    });

    console.log('\n📊 Summary:');
    console.log(`   - User: ${finalCheck.name} (${finalCheck.nik})`);
    console.log(`   - Pendaftaran: ${finalCheck.registrations.length}`);
    console.log(`   - Hasil Lab: ${finalCheck.registrations[0]?.hasilLab ? 'Ada' : 'Tidak ada'}`);

    console.log('\n🔑 Login Credentials:');
    console.log(`   NIK: ${mussaNIK}`);
    console.log(`   Password: ${mussaPassword}`);

    console.log('\n✨ Data Mussa dengan hasil lab sudah siap!\n');
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
