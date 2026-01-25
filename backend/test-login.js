const axios = require('axios');

async function testLogin() {
    try {
        console.log('🔐 Testing login...\n');

        const credentials = {
            nik: '1234567890123456',
            password: '01011990'
        };

        console.log('Credentials:');
        console.log('NIK:', credentials.nik);
        console.log('Password:', credentials.password);
        console.log('\nSending request to: http://localhost:3000/api/auth/login\n');

        const response = await axios.post('http://localhost:3001/api/auth/login', credentials);

        console.log('✅ Login successful!');
        console.log('\nResponse:');
        console.log(JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.error('❌ Login failed!');

        if (error.response) {
            console.error('\nServer responded with error:');
            console.error('Status:', error.response.status);
            console.error('Message:', error.response.data.message);
            console.error('\nFull response:');
            console.error(JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.error('\nNo response from server!');
            console.error('Is the backend running on port 3000?');
        } else {
            console.error('\nError:', error.message);
        }
    }
}

testLogin();
