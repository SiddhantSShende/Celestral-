const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');

// User routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refreshToken);

// Admin routes
router.post('/admin/login', authController.adminLogin);

module.exports = router;
