const mongoose = require('mongoose');

const habitLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    habitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Habit',
      required: true
    },
    date: {
      type: String, // Format: YYYY-MM-DD
      required: true
    },
    status: {
      type: String,
      enum: ['completed', 'partial', 'missed'],
      default: 'missed'
    },
    targetText: {
      type: String,
      default: ''
    },
    actualValue: {
      type: Number,
      default: 0
    },
    notes: {
      type: String,
      default: ''
    },
    completedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

// Ensure one log entry per habit per user per date
habitLogSchema.index({ userId: 1, habitId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('HabitLog', habitLogSchema);
