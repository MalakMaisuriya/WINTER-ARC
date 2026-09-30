const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      default: 'Malak Maisuriya'
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    education: {
      type: String,
      default: 'BCA Semester 5'
    },
    career: {
      type: String,
      default: 'Full Stack Web Developer'
    },
    currentStatus: {
      type: String,
      default: 'Student / Fresher / Looking for Job'
    },
    bio: {
      type: String,
      default: 'Dedicated full-stack web developer building long-term habits and career skills through Winter Arc.'
    },
    avatarUrl: {
      type: String,
      default: ''
    },
    theme: {
      type: String,
      enum: ['dark', 'light'],
      default: 'dark'
    }
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
