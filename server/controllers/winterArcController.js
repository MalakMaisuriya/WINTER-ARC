const WinterArc = require('../models/WinterArc');

// Helper to compute Day N count accurately based on user's start date
const calculateWinterArcDay = (startDate) => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return diffDays > 0 ? diffDays : 1;
};

// @desc    Get Winter Arc details
// @route   GET /api/winterarc
// @access  Private
const getWinterArc = async (req, res) => {
  try {
    let arc = await WinterArc.findOne({ userId: req.user._id });
    if (!arc) {
      arc = await WinterArc.create({
        userId: req.user._id,
        startDate: new Date(),
        hasEndDate: false,
        isActive: true
      });
    }

    const currentDay = calculateWinterArcDay(arc.startDate);

    res.json({
      _id: arc._id,
      startDate: arc.startDate,
      endDate: arc.endDate,
      hasEndDate: arc.hasEndDate,
      isActive: arc.isActive,
      goalStatement: arc.goalStatement,
      currentDay
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Start / Update Winter Arc
// @route   POST /api/winterarc/start
// @access  Private
const startWinterArc = async (req, res) => {
  try {
    const { startDate, endDate, hasEndDate, goalStatement } = req.body;

    let arc = await WinterArc.findOne({ userId: req.user._id });
    if (!arc) {
      arc = new WinterArc({ userId: req.user._id });
    }

    arc.startDate = startDate ? new Date(startDate) : new Date();
    arc.hasEndDate = Boolean(hasEndDate);
    arc.endDate = hasEndDate && endDate ? new Date(endDate) : null;
    if (goalStatement) arc.goalStatement = goalStatement;
    arc.isActive = true;

    const updatedArc = await arc.save();
    const currentDay = calculateWinterArcDay(updatedArc.startDate);

    res.json({
      _id: updatedArc._id,
      startDate: updatedArc.startDate,
      endDate: updatedArc.endDate,
      hasEndDate: updatedArc.hasEndDate,
      isActive: updatedArc.isActive,
      goalStatement: updatedArc.goalStatement,
      currentDay
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getWinterArc, startWinterArc, calculateWinterArcDay };
