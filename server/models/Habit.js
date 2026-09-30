const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: ['MORNING', 'STUDY', 'DEVELOPMENT', 'CAREER', 'HEALTH', 'DIGITAL DISCIPLINE', 'NIGHT', 'CUSTOM'],
      default: 'CUSTOM'
    },
    targetText: {
      type: String,
      default: ''
    },
    targetValue: {
      type: Number,
      default: 1
    },
    targetUnit: {
      type: String,
      default: 'times' // hours, minutes, times, boolean
    },
    preferredTime: {
      type: String,
      default: '08:00'
    },
    reminderEnabled: {
      type: Boolean,
      default: false
    },
    order: {
      type: Number,
      default: 0
    },
    isDefault: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,
      default: '#3b82f6'
    },
    icon: {
      type: String,
      default: 'CheckCircle'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Habit', habitSchema);
