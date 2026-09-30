const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  isCompleted: { type: Boolean, default: false }
});

const goalSchema = new mongoose.Schema(
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
    description: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      enum: ['Personal', 'Health', 'BCA', 'Development', 'Career', 'Finance', 'Other'],
      default: 'Career'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    targetDate: {
      type: Date
    },
    progressPercent: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed'],
      default: 'In Progress'
    },
    milestones: [milestoneSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Goal', goalSchema);
