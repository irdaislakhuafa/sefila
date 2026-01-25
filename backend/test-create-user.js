const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testCreateUser() {
    try {
        console.log('============================================');
        console.log('🧪 Testing User Creation by Admin');
        console.log('============================================\n');

        // Step 1: Login as admin
        console.log('📝 Step 1: Login sebagai Admin...');

        const adminCredentials = {
            nik: '1234567890123456',
            password: '01011990'
        };

        console.log('   NIK:', adminCredentials.nik);
        console.log('   Password:', adminCredentials.password);

        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, adminCredentials);

        if (!loginResponse.data.success) {
            throw new Error('Login failed: ' + loginResponse.data.message);
        }

        console.log('   ✅ Login berhasil!');
        console.log('   User:', loginResponse.data.data.user.name);
        console.log('   Role:', loginResponse.data.data.user.role);

        const token = loginResponse.data.data.token;

        // Step 2: Create new patient user
        console.log('\n📝 Step 2: Membuat user baru (patient)...');

        // Generate unique NIK with timestamp to avoid duplicate
        const uniqueNik = '99' + Date.now().toString().slice(-14).padStart(14, '0');
        const newPatientData = {
            nik: uniqueNik,
            name: 'Test Patient API',
            birthDate: '1995-05-15',
            email: 'testpatient@example.com',
            phoneNumber: '081234567890'
        };

        console.log('   Data pasien:');
        console.log('   - NIK:', newPatientData.nik);
        console.log('   - Nama:', newPatientData.name);
        console.log('   - Tanggal Lahir:', newPatientData.birthDate);
        console.log('   - Email:', newPatientData.email);
        console.log('   - No. HP:', newPatientData.phoneNumber);

        const createResponse = await axios.post(
            `${BASE_URL}/admin/users`,
            newPatientData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('\n   ✅ User berhasil dibuat!');
        console.log('\n📋 Response dari server:');
        console.log(JSON.stringify(createResponse.data, null, 2));

        // Step 3: Test login with new user
        console.log('\n📝 Step 3: Test login dengan user baru...');

        const newUserCredentials = {
            nik: newPatientData.nik,
            password: createResponse.data.data.password // Password dari response
        };

        console.log('   NIK:', newUserCredentials.nik);
        console.log('   Password:', newUserCredentials.password);

        const newUserLoginResponse = await axios.post(`${BASE_URL}/auth/login`, newUserCredentials);

        if (newUserLoginResponse.data.success) {
            console.log('   ✅ Login user baru berhasil!');
            console.log('   User:', newUserLoginResponse.data.data.user.name);
        }

        console.log('\n============================================');
        console.log('🎉 Semua test berhasil!');
        console.log('============================================');

    } catch (error) {
        console.error('\n❌ Test gagal!');

        if (error.response) {
            console.error('\nServer responded with error:');
            console.error('Status:', error.response.status);
            console.error('Response:');
            console.error(JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.error('\nNo response from server!');
            console.error('Pastikan backend berjalan di port 3001');
        } else {
            console.error('\nError:', error.message);
        }
    }
}

testCreateUser();
