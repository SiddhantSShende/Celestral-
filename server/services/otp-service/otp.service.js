const { db } = require('../../config/firebase.config');
const crypto = require('crypto');

class OTPService {
    constructor() {
        this.OTP_EXPIRY_MINUTES = parseInt(process.env.OTP_EXPIRY_MINUTES) || 5;
    }

    // Generate 6-digit OTP
    generateOTP() {
        return crypto.randomInt(100000, 999999).toString();
    }

    // Hash OTP for storage
    hashOTP(otp) {
        return crypto.createHash('sha256').update(otp).digest('hex');
    }

    // Send OTP for phone verification (logged to console)
    async sendSMSOTP(phoneNumber, userId) {
        try {
            const otp = this.generateOTP();
            const hashedOTP = this.hashOTP(otp);
            const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000);

            // Get user email
            const userDoc = await db.collection('users').doc(userId).get();
            if (!userDoc.exists) {
                throw new Error('User not found');
            }

            const userEmail = userDoc.data().email;

            // Store OTP in database
            await db.collection('otps').add({
                identifier: phoneNumber,
                email: userEmail,
                otp: hashedOTP,
                type: 'sms',
                purpose: 'phone_verification',
                userId,
                expiresAt: expiresAt.toISOString(),
                attempts: 0,
                verified: false,
                createdAt: new Date().toISOString()
            });

            // Log OTP to console (no email sending)
            console.log('');
            console.log('📱 ========================================');
            console.log('📱 PHONE VERIFICATION OTP');
            console.log('📱 ========================================');
            console.log(`📧 User Email: ${userEmail}`);
            console.log(`📞 Phone Number: ${phoneNumber}`);
            console.log(`🔐 OTP CODE: ${otp}`);
            console.log(`⏰ Valid for: ${this.OTP_EXPIRY_MINUTES} minutes`);
            console.log('📱 ========================================');
            console.log('');

            return {
                success: true,
                message: 'OTP sent successfully',
                expiresAt: expiresAt.toISOString(),
                // Include OTP in development mode
                ...(process.env.NODE_ENV === 'development' && { otp })
            };
        } catch (error) {
            console.error('❌ Error generating OTP:', error);
            throw new Error('Failed to send verification code: ' + error.message);
        }
    }

    // Verify OTP
    async verifyOTP(identifier, otp) {
        try {
            const hashedOTP = this.hashOTP(otp);

            // Find OTP record
            const otpsSnapshot = await db.collection('otps')
                .where('identifier', '==', identifier)
                .where('otp', '==', hashedOTP)
                .where('verified', '==', false)
                .get();

            if (otpsSnapshot.empty) {
                throw new Error('Invalid or expired OTP');
            }

            const otpDoc = otpsSnapshot.docs[0];
            const otpData = otpDoc.data();

            // Check expiration
            if (new Date(otpData.expiresAt) < new Date()) {
                throw new Error('OTP has expired');
            }

            // Mark as verified
            await db.collection('otps').doc(otpDoc.id).update({
                verified: true,
                verifiedAt: new Date().toISOString()
            });

            // Update user's phone verification status
            if (otpData.userId) {
                await db.collection('users').doc(otpData.userId).update({
                    phoneVerified: true,
                    updatedAt: new Date().toISOString()
                });
            }

            console.log(`✅ OTP verified successfully for ${identifier}`);

            return {
                success: true,
                message: 'OTP verified successfully',
                userId: otpData.userId
            };
        } catch (error) {
            console.error('❌ OTP verification error:', error);
            throw error;
        }
    }

    // Resend OTP
    async resendOTP(identifier, userId) {
        // Delete old OTPs for this identifier
        const oldOTPs = await db.collection('otps')
            .where('identifier', '==', identifier)
            .where('verified', '==', false)
            .get();

        for (const doc of oldOTPs.docs) {
            await db.collection('otps').doc(doc.id).delete();
        }

        // Send new OTP
        return await this.sendSMSOTP(identifier, userId);
    }
}

module.exports = new OTPService();
