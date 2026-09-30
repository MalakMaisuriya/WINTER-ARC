const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    technologies: [
      {
        type: String
      }
    ],
    startDate: {
      type: Date,
      default: Date.now
    },
    targetDate: {
      type: Date
    },
    status: {
      type: String,
      enum: ['Planning', 'In Progress', 'Testing', 'Completed'],
      default: 'In Progress'
    },
    githubUrl: {
      type: String,
      default: ''
    },
    liveUrl: {
      type: String,
      default: ''
    },
    progressPercent: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    notes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
