const DeveloperSkill = require('../models/DeveloperSkill');

// @desc    Get all developer skills for user
// @route   GET /api/developer/skills
// @access  Private
const getSkills = async (req, res) => {
  try {
    const skills = await DeveloperSkill.find({ userId: req.user._id }).sort({ createdAt: 1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update skill status
// @route   PUT /api/developer/skills/:id
// @access  Private
const updateSkill = async (req, res) => {
  try {
    const skill = await DeveloperSkill.findOne({ _id: req.params.id, userId: req.user._id });
    if (!skill) return res.status(404).json({ message: 'Skill not found' });

    if (req.body.status) skill.status = req.body.status;
    if (req.body.category) skill.category = req.body.category;

    const updated = await skill.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add topic to skill
// @route   POST /api/developer/skills/:id/topics
// @access  Private
const addTopic = async (req, res) => {
  try {
    const { title, startDate, targetDate, status, notes, resources, practiceCompleted } = req.body;
    const skill = await DeveloperSkill.findOne({ _id: req.params.id, userId: req.user._id });
    if (!skill) return res.status(404).json({ message: 'Skill not found' });

    skill.topics.push({
      title,
      startDate: startDate || new Date(),
      targetDate: targetDate || null,
      status: status || 'Not Started',
      notes: notes || '',
      resources: resources || '',
      practiceCompleted: Boolean(practiceCompleted)
    });

    const updated = await skill.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update topic in skill
// @route   PUT /api/developer/skills/:id/topics/:topicId
// @access  Private
const updateTopic = async (req, res) => {
  try {
    const skill = await DeveloperSkill.findOne({ _id: req.params.id, userId: req.user._id });
    if (!skill) return res.status(404).json({ message: 'Skill not found' });

    const topic = skill.topics.id(req.params.topicId);
    if (!topic) return res.status(404).json({ message: 'Topic not found' });

    if (req.body.title) topic.title = req.body.title;
    if (req.body.status) topic.status = req.body.status;
    if (req.body.notes !== undefined) topic.notes = req.body.notes;
    if (req.body.resources !== undefined) topic.resources = req.body.resources;
    if (req.body.practiceCompleted !== undefined) topic.practiceCompleted = req.body.practiceCompleted;
    if (req.body.targetDate !== undefined) topic.targetDate = req.body.targetDate;

    const updated = await skill.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSkills, updateSkill, addTopic, updateTopic };
