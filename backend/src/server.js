require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://sefila-frontend:80', 'http://143.14.13.3:5174'];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin || 'no origin'}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'SEFILA API Server is running' });
});

// Import routes
// app.use('/api/auth/register', ...) is DISABLED - admin creates users now
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/registrations', require('./routes/registration.routes'));
app.use('/api/lab-results', require('./routes/labResult.routes'));
app.use('/api/stats', require('./routes/stats.routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`🚀 SEFILA Server running on port ${PORT}`);
  console.log(`   API: http://localhost:${PORT}/api`);
  console.log(`   CORS allowed origins: ${allowedOrigins.join(", ")}`);
  console.log(`========================================`);
  console.log(`Server is ready to accept requests`);
});

// Log when process is about to exit
process.on('exit', (code) => {
  console.log(`Process exiting with code: ${code}`);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
