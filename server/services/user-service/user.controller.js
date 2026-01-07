const userService = require('./user.service');

class UserController {
    // Get user profile
    async getProfile(req, res, next) {
        try {
            const userId = req.user.userId;
            const profile = await userService.getUserProfile(userId);

            res.status(200).json({
                status: 'success',
                data: profile
            });
        } catch (error) {
            res.status(404).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Update user profile
    async updateProfile(req, res, next) {
        try {
            const userId = req.user.userId;
            const updates = req.body;

            const profile = await userService.updateUserProfile(userId, updates);

            res.status(200).json({
                status: 'success',
                message: 'Profile updated successfully',
                data: profile
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Get profile sections
    async getProfileSections(req, res, next) {
        try {
            const userId = req.user.userId;
            const sections = await userService.getProfileSections(userId);

            res.status(200).json({
                status: 'success',
                data: sections
            });
        } catch (error) {
            res.status(404).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Update specific section
    async updateSection(req, res, next) {
        try {
            const userId = req.user.userId;
            const { sectionId } = req.params;
            const data = req.body;

            const profile = await userService.updateProfileSection(userId, sectionId, data);

            res.status(200).json({
                status: 'success',
                message: 'Section updated successfully',
                data: profile
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Update assessment (questionnaire + preferences)
    async updateAssessment(req, res, next) {
        try {
            const userId = req.user.userId;
            const assessmentData = req.body;

            const profile = await userService.updateAssessment(userId, assessmentData);

            res.status(200).json({
                status: 'success',
                message: 'Assessment updated successfully',
                data: profile
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Change password
    async changePassword(req, res, next) {
        try {
            const userId = req.user.userId;
            const { currentPassword, newPassword } = req.body;

            if (!currentPassword || !newPassword) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Current password and new password are required'
                });
            }

            const result = await userService.changePassword(userId, currentPassword, newPassword);

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

    // Delete account
    async deleteAccount(req, res, next) {
        try {
            const userId = req.user.userId;
            const result = await userService.deleteAccount(userId);

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

    // Get all users (admin only)
    async getAllUsers(req, res, next) {
        try {
            const filters = {
                gender: req.query.gender,
                status: req.query.status
            };

            const users = await userService.getAllUsers(filters);

            res.status(200).json({
                status: 'success',
                data: {
                    total: users.length,
                    users
                }
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
}

module.exports = new UserController();
