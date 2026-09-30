const User = require('../models/User');
const UserSettings = require('../models/UserSettings');

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.education = req.body.education || user.education;
    user.career = req.body.career || user.career;
    user.currentStatus = req.body.currentStatus || user.currentStatus;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
    user.avatarUrl = req.body.avatarUrl !== undefined ? req.body.avatarUrl : user.avatarUrl;
    user.theme = req.body.theme || user.theme;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      education: updatedUser.education,
      career: updatedUser.career,
      currentStatus: updatedUser.currentStatus,
      bio: updatedUser.bio,
      avatarUrl: updatedUser.avatarUrl,
      theme: updatedUser.theme
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Change user password
// @route   PUT /api/user/password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current and new password' });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user settings
// @route   GET /api/user/settings
// @access  Private
const getSettings = async (req, res) => {
  try {
    let settings = await UserSettings.findOne({ userId: req.user._id });
    if (!settings) {
      settings = await UserSettings.create({ userId: req.user._id });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user settings
// @route   PUT /api/user/settings
// @access  Private
const updateSettings = async (req, res) => {
  try {
    let settings = await UserSettings.findOne({ userId: req.user._id });
    if (!settings) {
      settings = new UserSettings({ userId: req.user._id });
    }

    if (req.body.streakThresholdPercent !== undefined) {
      settings.streakThresholdPercent = req.body.streakThresholdPercent;
    }
    if (req.body.theme !== undefined) {
      settings.theme = req.body.theme;
      // also sync user model theme
      await User.findByIdAndUpdate(req.user._id, { theme: req.body.theme });
    }
    if (req.body.screenTimeLimitHours !== undefined) {
      settings.screenTimeLimitHours = req.body.screenTimeLimitHours;
    }
    if (req.body.notificationsEnabled !== undefined) {
      settings.notificationsEnabled = req.body.notificationsEnabled;
    }

    const updated = await settings.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateProfile, changePassword, getSettings, updateSettings };
