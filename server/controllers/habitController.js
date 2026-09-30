const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');
const { getTodayString } = require('../utils/dateUtils');
const { checkAndUnlockAchievements } = require('./achievementController');

// @desc    Get user habits with log status for a date
// @route   GET /api/habits
// @access  Private
const getHabits = async (req, res) => {
  try {
    const targetDate = req.query.date || getTodayString();
    const includeInactive = req.query.includeInactive === 'true';

    const query = { userId: req.user._id };
    if (!includeInactive) {
      query.isActive = true;
    }

    const habits = await Habit.find(query).sort({ order: 1, createdAt: 1 });

    // Fetch logs for targetDate
    const logs = await HabitLog.find({
      userId: req.user._id,
      date: targetDate
    });

    const logMap = {};
    logs.forEach(log => {
      logMap[log.habitId.toString()] = log;
    });

    const habitsWithStatus = habits.map(h => {
      const hObj = h.toObject();
      const existingLog = logMap[h._id.toString()];
      hObj.todayLog = existingLog || {
        status: 'missed',
        actualValue: 0,
        notes: '',
        targetText: h.targetText
      };
      return hObj;
    });

    res.json(habitsWithStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create custom habit
// @route   POST /api/habits
// @access  Private
const createHabit = async (req, res) => {
  try {
    const { title, category, targetText, targetValue, targetUnit, preferredTime, reminderEnabled, color, icon } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Habit title is required' });
    }

    const count = await Habit.countDocuments({ userId: req.user._id });

    const habit = await Habit.create({
      userId: req.user._id,
      title,
      category: category || 'CUSTOM',
      targetText: targetText || '',
      targetValue: targetValue || 1,
      targetUnit: targetUnit || 'times',
      preferredTime: preferredTime || '08:00',
      reminderEnabled: Boolean(reminderEnabled),
      order: count + 1,
      isDefault: false,
      isActive: true,
      color: color || '#3b82f6',
      icon: icon || 'CheckCircle'
    });

    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update habit definition
// @route   PUT /api/habits/:id
// @access  Private
const updateHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id });
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    habit.title = req.body.title || habit.title;
    habit.category = req.body.category || habit.category;
    habit.targetText = req.body.targetText !== undefined ? req.body.targetText : habit.targetText;
    habit.targetValue = req.body.targetValue !== undefined ? req.body.targetValue : habit.targetValue;
    habit.targetUnit = req.body.targetUnit || habit.targetUnit;
    habit.preferredTime = req.body.preferredTime || habit.preferredTime;
    habit.reminderEnabled = req.body.reminderEnabled !== undefined ? req.body.reminderEnabled : habit.reminderEnabled;
    habit.order = req.body.order !== undefined ? req.body.order : habit.order;
    habit.color = req.body.color || habit.color;
    habit.icon = req.body.icon || habit.icon;
    if (req.body.isActive !== undefined) habit.isActive = req.body.isActive;

    const updated = await habit.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Disable/Soft delete habit (keeps historical data!)
// @route   DELETE /api/habits/:id
// @access  Private
const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id });
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    // Mark inactive instead of deleting document to preserve historical records!
    habit.isActive = false;
    await habit.save();

    res.json({ message: 'Habit disabled successfully. Historical records preserved.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Log / toggle daily habit status for a date
// @route   POST /api/habits/:id/log
// @access  Private
const logHabitDaily = async (req, res) => {
  try {
    const { date, status, actualValue, notes } = req.body;
    const targetDate = date || getTodayString();

    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id });
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    let log = await HabitLog.findOne({
      userId: req.user._id,
      habitId: habit._id,
      date: targetDate
    });

    if (!log) {
      log = new HabitLog({
        userId: req.user._id,
        habitId: habit._id,
        date: targetDate,
        targetText: habit.targetText
      });
    }

    log.status = status || (log.status === 'completed' ? 'missed' : 'completed');
    if (actualValue !== undefined) log.actualValue = actualValue;
    if (notes !== undefined) log.notes = notes;
    if (log.status === 'completed') log.completedAt = new Date();

    await log.save();

    // Trigger asynchronous badge check
    checkAndUnlockAchievements(req.user._id).catch(err => console.error('Achievement check error:', err));

    res.json({
      habitId: habit._id,
      date: targetDate,
      log
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get habit log history across dates
// @route   GET /api/habits/history
// @access  Private
const getHabitHistory = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { userId: req.user._id };

    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    }

    const logs = await HabitLog.find(query).populate('habitId', 'title category color icon targetText');
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  logHabitDaily,
  getHabitHistory,
  getTodayString
};
