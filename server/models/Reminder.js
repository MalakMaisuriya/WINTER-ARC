const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    time: {
      type: String, // e.g., "07:00 AM"
      required: true
    },
    category: {
      type: String,
      default: 'General'
    },
    isEnabled: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reminder', reminderSchema);
