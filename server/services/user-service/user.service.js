const { db } = require('../../config/firebase.config');

class UserService {
    // Get user profile
    async getUserProfile(userId) {
        try {
            const userDoc = await db.collection('users').doc(userId).get();

            if (!userDoc.exists) {
                throw new Error('User not found');
            }

            const userData = userDoc.data();

            // Remove sensitive data
            delete userData.passwordHash;

            return {
                id: userDoc.id,
                ...userData
            };
        } catch (error) {
            throw error;
        }
    }

    // Update user profile
    async updateUserProfile(userId, updates) {
        try {
            const allowedUpdates = ['profile', 'questionnaire', 'preferences'];
            const updateData = {};

            // Filter allowed updates
            Object.keys(updates).forEach(key => {
                if (allowedUpdates.includes(key)) {
                    updateData[key] = updates[key];
                }
            });

            updateData.updatedAt = new Date().toISOString();

            await db.collection('users').doc(userId).update(updateData);

            return await this.getUserProfile(userId);
        } catch (error) {
            throw error;
        }
    }

    // Update specific profile section
    async updateProfileSection(userId, section, data) {
        try {
            const validSections = ['profile', 'questionnaire', 'preferences'];

            if (!validSections.includes(section)) {
                throw new Error('Invalid section');
            }

            const updateData = {
                [section]: data,
                updatedAt: new Date().toISOString()
            };

            await db.collection('users').doc(userId).update(updateData);

            return await this.getUserProfile(userId);
        } catch (error) {
            throw error;
        }
    }

    // Get profile sections (for dashboard)
    async getProfileSections(userId) {
        try {
            const userData = await this.getUserProfile(userId);

            return {
                personalInfo: {
                    fullName: userData.profile?.fullName,
                    gender: userData.profile?.gender,
                    age: userData.profile?.age,
                    height: userData.profile?.height,
                    location: userData.profile?.location,
                    dateOfBirth: userData.profile?.dateOfBirth,
                    email: userData.email,
                    phoneNumber: userData.phoneNumber,
                    photoURL: userData.profile?.photoURL
                },
                questionsAndPreferences: {
                    questionnaire: userData.questionnaire || {},
                    preferences: userData.preferences || {}
                },
                accountSettings: {
                    emailVerified: userData.emailVerified,
                    phoneVerified: userData.phoneVerified,
                    createdAt: userData.createdAt,
                    lastLogin: userData.status?.lastLogin
                }
            };
        } catch (error) {
            throw error;
        }
    }

    // Update assessment data (questionnaire + preferences)
    async updateAssessment(userId, assessmentData) {
        try {
            const { questionnaire, preferences } = assessmentData;

            const updateData = {
                updatedAt: new Date().toISOString(),
                'status.assessmentStatus': 'completed'
            };

            if (questionnaire) {
                updateData.questionnaire = questionnaire;
            }

            if (preferences) {
                updateData.preferences = preferences;
            }

            await db.collection('users').doc(userId).update(updateData);

            return await this.getUserProfile(userId);
        } catch (error) {
            throw error;
        }
    }

    // Change password
    async changePassword(userId, currentPassword, newPassword) {
        try {
            const bcrypt = require('bcryptjs');
            const userDoc = await db.collection('users').doc(userId).get();

            if (!userDoc.exists) {
                throw new Error('User not found');
            }

            const userData = userDoc.data();

            // Verify current password
            const isValid = await bcrypt.compare(currentPassword, userData.passwordHash);
            if (!isValid) {
                throw new Error('Current password is incorrect');
            }

            // Hash new password
            const newPasswordHash = await bcrypt.hash(newPassword, 10);

            await db.collection('users').doc(userId).update({
                passwordHash: newPasswordHash,
                updatedAt: new Date().toISOString()
            });

            return { success: true, message: 'Password changed successfully' };
        } catch (error) {
            throw error;
        }
    }

    // Delete user account
    async deleteAccount(userId) {
        try {
            await db.collection('users').doc(userId).delete();
            return { success: true, message: 'Account deleted successfully' };
        } catch (error) {
            throw error;
        }
    }

    // Get all users (admin only)
    async getAllUsers(filters = {}) {
        try {
            let query = db.collection('users');

            // Apply filters
            if (filters.gender) {
                query = query.where('profile.gender', '==', filters.gender);
            }

            if (filters.status) {
                query = query.where('status.assessmentStatus', '==', filters.status);
            }

            const snapshot = await query.get();
            const users = [];

            snapshot.forEach(doc => {
                const userData = doc.data();
                delete userData.passwordHash;
                users.push({
                    id: doc.id,
                    ...userData
                });
            });

            return users;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new UserService();
