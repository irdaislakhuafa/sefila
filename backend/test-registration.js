const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testRegistration() {
    try {
        console.log('============================================');
        console.log('🧪 Testing Patient Registration (IVA Test)');
        console.log('============================================\n');

        // Step 1: Login as patient
        console.log('📝 Step 1: Login sebagai Patient...');

        const patientCredentials = {
            nik: '1111111111111111',  // Test patient dari database
            password: '11111111'       // Password dari birthdate
        };

        console.log('   NIK:', patientCredentials.nik);
        console.log('   Password:', patientCredentials.password);

        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, patientCredentials);

        if (!loginResponse.data.success) {
            throw new Error('Login failed: ' + loginResponse.data.message);
        }

        console.log('   ✅ Login berhasil!');
        console.log('   User:', loginResponse.data.data.user.name);
        console.log('   Role:', loginResponse.data.data.user.role);

        const token = loginResponse.data.data.token;

        // Step 2: Submit registration
        console.log('\n📝 Step 2: Submit pendaftaran IVA Test...');

        const registrationData = {
            nik: patientCredentials.nik,
            nama: 'Test Patient',
            tanggalLahir: '1995-05-15',
            alamat: 'Jl. Mawar No. 123, RT 01/RW 02',
            kelurahan: 'Bugangan',
            kecamatan: 'Semarang Timur',
            noTelepon: '081234567890',
            instansi: 'PT. Test Company',
            tidakHaid: true,
            tidakDouching: true,
            tidakBerhubungan: true,
            tidakPapsmear: true,
            tidakHamil: true,
            tidakMenyusui: true,
            tidakInfeksi: true
        };

        console.log('   Data registrasi:');
        console.log('   - NIK:', registrationData.nik);
        console.log('   - Nama:', registrationData.nama);
        console.log('   - Kecamatan:', registrationData.kecamatan);
        console.log('   - Instansi:', registrationData.instansi);

        const regResponse = await axios.post(
            `${BASE_URL}/registrations`,
            registrationData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('\n   ✅ Pendaftaran berhasil!');
        console.log('\n📋 Response dari server:');
        console.log(JSON.stringify(regResponse.data, null, 2));

        console.log('\n============================================');
        console.log('🎉 Test registrasi berhasil!');
        console.log('============================================');

    } catch (error) {
        console.error('\n❌ Test gagal!');

        if (error.response) {
            console.error('\nServer responded with error:');
            console.error('Status:', error.response.status);
            console.error('Message:', error.response.data.message);
            console.error('\nFull response:');
            console.error(JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.error('\nNo response from server!');
            console.error('Pastikan backend berjalan di port 3001');
        } else {
            console.error('\nError:', error.message);
        }
    }
}

testRegistration();
