require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Simple CORS - allow all
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'SEFILA API Server is running', port: PORT });
});

// Auth login route
app.post('/api/auth/login', async (req, res) => {
    console.log('Login attempt:', req.body);
    try {
        const { nik, password } = req.body;

        if (nik === '1234567890123456' && password === '01011990') {
            res.json({
                success: true,
                message: 'Login berhasil!',
                data: {
                    user: {
                        id: 1,
                        nik: '1234567890123456',
                        name: 'Admin SEFILA',
                        role: 'ADMIN'
                    },
                    token: 'test-token-123'
                }
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'NIK atau password salah.'
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat login.'
        });
    }
});

const server = app.listen(PORT, () => {
    console.log(`🚀 Test Server running on http://localhost:${PORT}`);
    console.log(`CORS enabled for all origins`);
    console.log(`Server is ready to accept connections`);
});

// Keep the process alive
setInterval(() => {
    // This keeps the event loop alive
}, 1000000);

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, closing server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received, closing server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
