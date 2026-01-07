const express = require('express');
const otpController = require('./otp.controller');
const { verifyToken } = require('../auth-service/auth.middleware');

const router = express.Router();

// OTP routes
router.post('/send-sms', otpController.sendSMS);
router.post('/send-email', otpController.sendEmail);
router.post('/verify-sms', otpController.verifySMS);
router.post('/verify-email', otpController.verifyEmail);
router.post('/resend', otpController.resend);

module.exports = router;
