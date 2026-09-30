const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: ['weekly', 'monthly'],
      required: true
    },
    periodIdentifier: {
      type: String, // e.g. "2026-W40" or "2026-10"
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    completionRate: {
      type: Number,
      default: 0
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
    averageSleep: {
      type: Number,
      default: 0
    },
    averageProductivity: {
      type: Number,
      default: 0
    },
    bestHabit: {
      type: String,
      default: ''
    },
    weakestHabit: {
      type: String,
      default: ''
    },
    whatWentWell: {
      type: String,
      default: ''
    },
    whatWentWrong: {
      type: String,
      default: ''
    },
    improvements: {
      type: String,
      default: ''
    },
    mainGoalNextPeriod: {
      type: String,
      default: ''
    },
    monthlyReflection: {
      type: String,
      default: ''
    },
    nextMonthGoals: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

reviewSchema.index({ userId: 1, type: 1, periodIdentifier: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
