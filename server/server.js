const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// Import routes
const authRoutes = require('./services/auth-service/auth.routes');
const otpRoutes = require('./services/otp-service/otp.routes');
const userRoutes = require('./services/user-service/user.routes');

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Celestral Backend is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/users', userRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        status: 'error',
        message: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log('');
    console.log('🚀 ========================================');
    console.log(`🚀 Celestral Backend Server`);
    console.log(`🚀 Port: ${PORT}`);
    console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('🚀 ========================================');
    console.log('');
    console.log('📡 API Endpoints:');
    console.log(`   Health: http://localhost:${PORT}/health`);
    console.log(`   Auth:   http://localhost:${PORT}/api/auth/*`);
    console.log(`   OTP:    http://localhost:${PORT}/api/otp/*`);
    console.log(`   Users:  http://localhost:${PORT}/api/users/*`);
    console.log('');

    // Seed default admin account
    const { seedAdmin } = require('./config/seed-admin');
    await seedAdmin();

    console.log('✅ Server ready');
    console.log('');
});

module.exports = app;
