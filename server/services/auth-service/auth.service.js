const { db } = require('../../config/firebase.config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
    constructor() {
        this.JWT_SECRET = process.env.JWT_SECRET || 'celestral-secret-key-change-in-production';
        this.JWT_EXPIRY = '24h';
        this.REFRESH_TOKEN_EXPIRY = '7d';
    }

    // Generate JWT token
    generateToken(userId, role = 'user') {
        return jwt.sign(
            { userId, role },
            this.JWT_SECRET,
            { expiresIn: this.JWT_EXPIRY }
        );
    }

    // Generate refresh token
    generateRefreshToken(userId) {
        return jwt.sign(
            { userId, type: 'refresh' },
            this.JWT_SECRET,
            { expiresIn: this.REFRESH_TOKEN_EXPIRY }
        );
    }

    // Hash password
    async hashPassword(password) {
        return await bcrypt.hash(password, 10);
    }

    // Compare password
    async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }

    // Register new user
    async registerUser(userData) {
        const { email, password, phoneNumber, ...profileData } = userData;

        // Check if user exists
        const existingUsers = await db.collection('users').where('email', '==', email).get();
        if (!existingUsers.empty) {
            throw new Error('User with this email already exists');
        }

        // Hash password
        const passwordHash = await this.hashPassword(password);

        // Create user document
        const userDoc = {
            email,
            passwordHash,
            phoneNumber,
            profile: profileData,
            phoneVerified: true, // Auto-verified, no OTP needed
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Save to database
        const userRef = await db.collection('users').add(userDoc);
        const userId = userRef.id;

        // Generate tokens
        const token = this.generateToken(userId, 'user');
        const refreshToken = this.generateRefreshToken(userId);

        return {
            userId,
            token,
            refreshToken,
            user: {
                id: userId,
                email,
                phoneNumber,
                phoneVerified: true,
                profile: profileData
            }
        };
    }

    // Login user
    async loginUser(email, password) {
        // Find user
        const usersSnapshot = await db.collection('users').where('email', '==', email).get();

        if (usersSnapshot.empty) {
            throw new Error('Invalid credentials');
        }

        const userDoc = usersSnapshot.docs[0];
        const userData = userDoc.data();
        const userId = userDoc.id;

        // Check password
        const isPasswordValid = await this.comparePassword(password, userData.passwordHash);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        // Generate tokens
        const token = this.generateToken(userId, 'user');
        const refreshToken = this.generateRefreshToken(userId);

        // Update last login
        await db.collection('users').doc(userId).update({
            lastLogin: new Date().toISOString()
        });

        return {
            token,
            refreshToken,
            user: {
                id: userId,
                email: userData.email,
                phoneNumber: userData.phoneNumber,
                phoneVerified: userData.phoneVerified,
                profile: userData.profile
            }
        };
    }

    // Admin login (direct, no OTP)
    async adminLogin(email, password) {
        // Find admin
        const adminsSnapshot = await db.collection('admins').where('email', '==', email).get();

        if (adminsSnapshot.empty) {
            throw new Error('Invalid admin credentials');
        }

        const adminDoc = adminsSnapshot.docs[0];
        const adminData = adminDoc.data();
        const adminId = adminDoc.id;

        // Check password
        const isPasswordValid = await this.comparePassword(password, adminData.passwordHash);
        if (!isPasswordValid) {
            throw new Error('Invalid admin credentials');
        }

        // Generate tokens
        const token = this.generateToken(adminId, 'admin');
        const refreshToken = this.generateRefreshToken(adminId);

        return {
            adminId,
            token,
            refreshToken,
            admin: {
                id: adminId,
                email: adminData.email,
                role: adminData.role,
                name: adminData.name
            }
        };
    }

    // Verify JWT token
    verifyToken(token) {
        try {
            return jwt.verify(token, this.JWT_SECRET);
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }

    // Refresh access token
    async refreshAccessToken(refreshToken) {
        const decoded = this.verifyToken(refreshToken);

        if (decoded.type !== 'refresh') {
            throw new Error('Invalid refresh token');
        }

        const newToken = this.generateToken(decoded.userId);

        return { token: newToken };
    }
}

module.exports = new AuthService();
