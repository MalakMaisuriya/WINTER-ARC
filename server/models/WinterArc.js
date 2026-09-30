const mongoose = require('mongoose');

const winterArcSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    endDate: {
      type: Date,
      default: null
    },
    hasEndDate: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    goalStatement: {
      type: String,
      default: 'Build the person you want to become.'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('WinterArc', winterArcSchema);
