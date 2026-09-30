const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { seedDefaultsForUser } = require('../utils/seedDefaults');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'winter_arc_super_secret_jwt_key_2026_malak', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, education, career, currentStatus, startDate, hasEndDate, endDate } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({
      name: name || 'Malak Maisuriya',
      email,
      password,
      education: education || 'BCA Semester 5',
      career: career || 'Full Stack Web Developer',
      currentStatus: currentStatus || 'Student / Fresher / Looking for Job'
    });

    // Seed defaults and setup Winter Arc
    const winterStartDate = startDate ? new Date(startDate) : new Date();
    await seedDefaultsForUser(user._id, winterStartDate);

    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      education: user.education,
      career: user.career,
      currentStatus: user.currentStatus,
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // Ensure defaults exist for user (if migrating or upgraded schema)
      await seedDefaultsForUser(user._id);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        education: user.education,
        career: user.career,
        currentStatus: user.currentStatus,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        theme: user.theme,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getMe };
