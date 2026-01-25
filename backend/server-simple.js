require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

console.log('Starting server...');
console.log('PORT from env:', process.env.PORT);

// CORS
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
}));

app.use(express.json());

// Simple test route
app.get('/', (req, res) => {
    res.json({ message: 'Server is running!', port: PORT });
});

// Simple login route (without database)
app.post('/api/auth/login', (req, res) => {
    console.log('Login request received:', req.body);

    const { nik, password } = req.body;

    if (nik === '1234567890123456' && password === '01011990') {
        return res.json({
            success: true,
            message: 'Login berhasil!',
            data: {
                user: {
                    id: 1,
                    nik: '1234567890123456',
                    name: 'Admin SEFILA',
                    email: 'admin@sefila.com',
                    role: 'ADMIN'
                },
                token: 'dummy-token-for-testing'
            }
        });
    }

    res.status(401).json({
        success: false,
        message: 'NIK atau password salah.'
    });
});

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('========================================');
    console.log(`✅ Server started successfully!`);
    console.log(`   URL: http://localhost:${PORT}`);
    console.log(`   API: http://localhost:${PORT}/api`);
    console.log('========================================');
});

server.on('error', (error) => {
    console.error('❌ Server error:', error);
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use!`);
        process.exit(1);
    }
});

console.log('Server setup complete, listening for connections...');
