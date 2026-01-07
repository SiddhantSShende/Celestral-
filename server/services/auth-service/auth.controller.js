const authService = require('./auth.service');

class AuthController {
    // Register new user
    async register(req, res, next) {
        try {
            const result = await authService.registerUser(req.body);

            res.status(201).json({
                status: 'success',
                message: 'User registered successfully',
                data: result
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Login user
    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email and password are required'
                });
            }

            const result = await authService.loginUser(email, password);

            // Set refresh token as httpOnly cookie
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.status(200).json({
                status: 'success',
                message: 'Login successful',
                data: {
                    token: result.token,
                    user: result.user
                }
            });
        } catch (error) {
            res.status(401).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Admin login (direct, no OTP)
    async adminLogin(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email and password are required'
                });
            }

            const result = await authService.adminLogin(email, password);

            // Set refresh token as httpOnly cookie
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.status(200).json({
                status: 'success',
                message: 'Admin login successful',
                data: {
                    token: result.token,
                    admin: result.admin
                }
            });
        } catch (error) {
            res.status(401).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Refresh token
    async refreshToken(req, res, next) {
        try {
            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Refresh token not found'
                });
            }

            const result = await authService.refreshAccessToken(refreshToken);

            res.status(200).json({
                status: 'success',
                message: 'Token refreshed successfully',
                data: result
            });
        } catch (error) {
            res.status(401).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Logout
    async logout(req, res) {
        res.clearCookie('refreshToken');
        res.status(200).json({
            status: 'success',
            message: 'Logged out successfully'
        });
    }
}

module.exports = new AuthController();
