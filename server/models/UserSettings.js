const mongoose = require('mongoose');

const userSettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    streakThresholdPercent: {
      type: Number,
      default: 80,
      min: 1,
      max: 100
    },
    theme: {
      type: String,
      enum: ['dark', 'light'],
      default: 'dark'
    },
    screenTimeLimitHours: {
      type: Number,
      default: 3
    },
    notificationsEnabled: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('UserSettings', userSettingsSchema);
