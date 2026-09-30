const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startDate: { type: Date, default: Date.now },
  targetDate: { type: Date },
  status: {
    type: String,
    enum: ['Not Started', 'Learning', 'Practicing', 'Completed'],
    default: 'Not Started'
  },
  notes: { type: String, default: '' },
  resources: { type: String, default: '' },
  practiceCompleted: { type: Boolean, default: false }
});

const developerSkillSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    skillName: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Not Started', 'Learning', 'Practicing', 'Project Ready', 'Interview Ready'],
      default: 'Learning'
    },
    category: {
      type: String,
      default: 'Core'
    },
    topics: [topicSchema]
  },
  { timestamps: true }
);

developerSkillSchema.index({ userId: 1, skillName: 1 }, { unique: true });

module.exports = mongoose.model('DeveloperSkill', developerSkillSchema);
