const Goal = require('../models/Goal');

// @desc    Get all goals for user
// @route   GET /api/goals
// @access  Private
const getGoals = async (req, res) => {
  try {
    let goals = await Goal.find({ userId: req.user._id }).sort({ createdAt: -1 });

    // Seed default sample goal if none exists yet
    if (goals.length === 0) {
      const sample = await Goal.create({
        userId: req.user._id,
        title: 'Become Job Ready as a Full Stack Web Developer',
        description: 'Complete comprehensive revision, build 2 production projects, update portfolio and apply to full stack roles.',
        category: 'Career',
        startDate: new Date(),
        targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        progressPercent: 35,
        status: 'In Progress',
        milestones: [
          { title: 'Complete React revision', isCompleted: true },
          { title: 'Complete Node.js revision', isCompleted: true },
          { title: 'Complete MongoDB revision', isCompleted: false },
          { title: 'Build 2 projects', isCompleted: true },
          { title: 'Update portfolio website', isCompleted: false },
          { title: 'Prepare resume', isCompleted: true },
          { title: 'Practice mock interviews', isCompleted: false },
          { title: 'Apply to 20 jobs', isCompleted: false }
        ]
      });
      goals = [sample];
    }

    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create goal
// @route   POST /api/goals
// @access  Private
const createGoal = async (req, res) => {
  try {
    const { title, description, category, startDate, targetDate, status, milestones } = req.body;

    if (!title) return res.status(400).json({ message: 'Goal title is required' });

    const milestoneList = Array.isArray(milestones) 
      ? milestones.map(m => (typeof m === 'string' ? { title: m, isCompleted: false } : m))
      : [];

    const totalMs = milestoneList.length;
    const completedMs = milestoneList.filter(m => m.isCompleted).length;
    const progressPercent = totalMs > 0 ? Math.round((completedMs / totalMs) * 100) : 0;

    const goal = await Goal.create({
      userId: req.user._id,
      title,
      description: description || '',
      category: category || 'Career',
      startDate: startDate || new Date(),
      targetDate: targetDate || null,
      status: status || 'In Progress',
      progressPercent,
      milestones: milestoneList
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update goal or toggle milestone
// @route   PUT /api/goals/:id
// @access  Private
const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.user._id });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });

    if (req.body.title) goal.title = req.body.title;
    if (req.body.description !== undefined) goal.description = req.body.description;
    if (req.body.category) goal.category = req.body.category;
    if (req.body.startDate) goal.startDate = req.body.startDate;
    if (req.body.targetDate !== undefined) goal.targetDate = req.body.targetDate;
    if (req.body.status) goal.status = req.body.status;

    if (req.body.milestones) {
      goal.milestones = req.body.milestones;
    }

    // Auto calculate progress percentage from milestones
    const totalMs = goal.milestones.length;
    if (totalMs > 0) {
      const completedMs = goal.milestones.filter(m => m.isCompleted).length;
      goal.progressPercent = Math.round((completedMs / totalMs) * 100);
      if (goal.progressPercent === 100) {
        goal.status = 'Completed';
      }
    } else if (req.body.progressPercent !== undefined) {
      goal.progressPercent = req.body.progressPercent;
    }

    const updated = await goal.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getGoals, createGoal, updateGoal, deleteGoal };
