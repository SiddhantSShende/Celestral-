const express = require('express');
const userController = require('./user.controller');
const { verifyToken, requireAuth, requireAdmin } = require('../auth-service/auth.middleware');

const router = express.Router();

// User routes (require authentication)
router.get('/profile', verifyToken, requireAuth, userController.getProfile);
router.put('/profile', verifyToken, requireAuth, userController.updateProfile);
router.get('/profile/sections', verifyToken, requireAuth, userController.getProfileSections);
router.put('/profile/section/:sectionId', verifyToken, requireAuth, userController.updateSection);
router.put('/assessment', verifyToken, requireAuth, userController.updateAssessment);
router.put('/change-password', verifyToken, requireAuth, userController.changePassword);
router.delete('/profile', verifyToken, requireAuth, userController.deleteAccount);

// Admin routes
router.get('/all', verifyToken, requireAdmin, userController.getAllUsers);

module.exports = router;
