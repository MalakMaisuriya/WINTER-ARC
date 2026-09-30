const express = require('express');
const router = express.Router();
const { updateProfile, changePassword, getSettings, updateSettings } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.get('/settings', protect, getSettings);
router.put('/settings', protect, updateSettings);

module.exports = router;
