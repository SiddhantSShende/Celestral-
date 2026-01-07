const otpService = require('./otp.service');

class OTPController {
    // Send SMS OTP
    async sendSMS(req, res, next) {
        try {
            const { phoneNumber, userId } = req.body;

            if (!phoneNumber || !userId) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Phone number and user ID are required'
                });
            }

            const result = await otpService.sendSMSOTP(phoneNumber, userId);

            res.status(200).json({
                status: 'success',
                data: result
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Send Email OTP
    async sendEmail(req, res, next) {
        try {
            const { email, adminId } = req.body;

            if (!email || !adminId) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email and admin ID are required'
                });
            }

            const result = await otpService.sendEmailOTP(email, adminId);

            res.status(200).json({
                status: 'success',
                data: result
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Verify SMS OTP
    async verifySMS(req, res, next) {
        try {
            const { phoneNumber, otp } = req.body;

            if (!phoneNumber || !otp) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Phone number and OTP are required'
                });
            }

            const result = await otpService.verifyOTP(phoneNumber, otp, 'sms');

            res.status(200).json({
                status: 'success',
                data: result
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Verify Email OTP
    async verifyEmail(req, res, next) {
        try {
            const { email, otp } = req.body;

            if (!email || !otp) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email and OTP are required'
                });
            }

            const result = await otpService.verifyOTP(email, otp, 'email');

            res.status(200).json({
                status: 'success',
                data: result
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Resend OTP
    async resend(req, res, next) {
        try {
            const { identifier, type, userId } = req.body;

            if (!identifier || !type || !userId) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Identifier, type, and user ID are required'
                });
            }

            const result = await otpService.resendOTP(identifier, type, userId);

            res.status(200).json({
                status: 'success',
                data: result
            });
        } catch (error) {
            res.status(429).json({
                status: 'error',
                message: error.message
            });
        }
    }
}

module.exports = new OTPController();
