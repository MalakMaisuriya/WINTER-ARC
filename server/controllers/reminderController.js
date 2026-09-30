const Reminder = require('../models/Reminder');

// @desc    Get all reminders for user
// @route   GET /api/reminders
// @access  Private
const getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.user._id }).sort({ time: 1 });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create reminder
// @route   POST /api/reminders
// @access  Private
const createReminder = async (req, res) => {
  try {
    const { title, time, category, isEnabled } = req.body;
    if (!title || !time) {
      return res.status(400).json({ message: 'Title and time are required' });
    }

    const reminder = await Reminder.create({
      userId: req.user._id,
      title,
      time,
      category: category || 'General',
      isEnabled: isEnabled !== undefined ? isEnabled : true
    });

    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update reminder
// @route   PUT /api/reminders/:id
// @access  Private
const updateReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({ _id: req.params.id, userId: req.user._id });
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });

    if (req.body.title) reminder.title = req.body.title;
    if (req.body.time) reminder.time = req.body.time;
    if (req.body.category) reminder.category = req.body.category;
    if (req.body.isEnabled !== undefined) reminder.isEnabled = req.body.isEnabled;

    const updated = await reminder.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete reminder
// @route   DELETE /api/reminders/:id
// @access  Private
const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
    res.json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getReminders, createReminder, updateReminder, deleteReminder };
