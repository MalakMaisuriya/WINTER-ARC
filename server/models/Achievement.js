const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    badgeKey: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: 'Flame'
    },
    unlockedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

achievementSchema.index({ userId: 1, badgeKey: 1 }, { unique: true });

module.exports = mongoose.model('Achievement', achievementSchema);
