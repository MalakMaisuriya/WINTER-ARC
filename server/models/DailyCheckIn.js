const mongoose = require('mongoose');

const dailyCheckInSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true
    },
    mood: {
      type: String,
      enum: ['great', 'good', 'normal', 'low'],
      default: 'good'
    },
    energy: {
      type: Number,
      min: 1,
      max: 10,
      default: 7
    },
    productivity: {
      type: Number,
      min: 1,
      max: 10,
      default: 7
    },
    sleepHours: {
      type: Number,
      default: 7
    },
    codingHours: {
      type: Number,
      default: 0
    },
    studyHours: {
      type: Number,
      default: 0
    },
    workoutMinutes: {
      type: Number,
      default: 0
    },
    screenTime: {
      type: Number,
      default: 0 // minutes
    },
    instagramTime: {
      type: Number,
      default: 0 // minutes
    },
    youtubeTime: {
      type: Number,
      default: 0 // minutes
    },
    gamingTime: {
      type: Number,
      default: 0 // minutes
    },
    accomplishments: {
      type: String,
      default: ''
    },
    improvements: {
      type: String,
      default: ''
    },
    topPriorityTomorrow: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

dailyCheckInSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyCheckIn', dailyCheckInSchema);
