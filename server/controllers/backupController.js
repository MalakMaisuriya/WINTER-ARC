const User = require('../models/User');
const WinterArc = require('../models/WinterArc');
const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');
const DailyCheckIn = require('../models/DailyCheckIn');
const DeveloperSkill = require('../models/DeveloperSkill');
const Project = require('../models/Project');
const JobApplication = require('../models/JobApplication');
const Goal = require('../models/Goal');
const Achievement = require('../models/Achievement');
const Review = require('../models/Review');
const Reminder = require('../models/Reminder');
const UserSettings = require('../models/UserSettings');

// @desc    Export all user data as JSON
// @route   GET /api/export/json
// @access  Private
const exportUserDataJson = async (req, res) => {
  try {
    const userId = req.user._id;

    const [
      user,
      winterArc,
      habits,
      habitLogs,
      dailyCheckIns,
      developerSkills,
      projects,
      jobApplications,
      goals,
      achievements,
      reviews,
      reminders,
      settings
    ] = await Promise.all([
      User.findById(userId).select('-password'),
      WinterArc.findOne({ userId }),
      Habit.find({ userId }),
      HabitLog.find({ userId }),
      DailyCheckIn.find({ userId }),
      DeveloperSkill.find({ userId }),
      Project.find({ userId }),
      JobApplication.find({ userId }),
      Goal.find({ userId }),
      Achievement.find({ userId }),
      Review.find({ userId }),
      Reminder.find({ userId }),
      UserSettings.findOne({ userId })
    ]);

    const exportData = {
      app: 'WINTER ARC',
      exportedAt: new Date().toISOString(),
      user,
      winterArc,
      habits,
      habitLogs,
      dailyCheckIns,
      developerSkills,
      projects,
      jobApplications,
      goals,
      achievements,
      reviews,
      reminders,
      settings
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=winter_arc_backup_${user.name.replace(/\s+/g, '_')}_${Date.now()}.json`);
    res.json(exportData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Export habit logs & checkins progress as CSV
// @route   GET /api/export/csv
// @access  Private
const exportUserDataCsv = async (req, res) => {
  try {
    const userId = req.user._id;
    const logs = await HabitLog.find({ userId }).populate('habitId', 'title category');
    const checkIns = await DailyCheckIn.find({ userId });

    let csvContent = 'Type,Date,Habit/Metric,Status/Value,Notes\n';

    logs.forEach(l => {
      const title = l.habitId ? `"${l.habitId.title}"` : 'Habit';
      const notes = l.notes ? `"${l.notes.replace(/"/g, '""')}"` : '';
      csvContent += `HabitLog,${l.date},${title},${l.status},${notes}\n`;
    });

    checkIns.forEach(c => {
      csvContent += `CheckIn,${c.date},"Mood / Productivity",${c.mood} - Prod: ${c.productivity}/10,Coding: ${c.codingHours}h Study: ${c.studyHours}h\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=winter_arc_progress_${Date.now()}.csv`);
    res.send(csvContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Import backup JSON data
// @route   POST /api/export/import
// @access  Private
const importUserData = async (req, res) => {
  try {
    const userId = req.user._id;
    const { backupData } = req.body;

    if (!backupData || backupData.app !== 'WINTER ARC') {
      return res.status(400).json({ message: 'Invalid Winter Arc backup JSON file' });
    }

    // Safely insert or update documents for this user
    if (backupData.habits && Array.isArray(backupData.habits)) {
      for (const h of backupData.habits) {
        delete h._id;
        h.userId = userId;
        await Habit.create(h).catch(() => {});
      }
    }

    if (backupData.dailyCheckIns && Array.isArray(backupData.dailyCheckIns)) {
      for (const c of backupData.dailyCheckIns) {
        delete c._id;
        c.userId = userId;
        await DailyCheckIn.findOneAndUpdate({ userId, date: c.date }, c, { upsert: true }).catch(() => {});
      }
    }

    if (backupData.projects && Array.isArray(backupData.projects)) {
      for (const p of backupData.projects) {
        delete p._id;
        p.userId = userId;
        await Project.create(p).catch(() => {});
      }
    }

    if (backupData.goals && Array.isArray(backupData.goals)) {
      for (const g of backupData.goals) {
        delete g._id;
        g.userId = userId;
        await Goal.create(g).catch(() => {});
      }
    }

    res.json({ message: 'Winter Arc backup data imported successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Permanently delete account and all user data
// @route   DELETE /api/user/account
// @access  Private
const deleteAccount = async (req, res) => {
  try {
    const { password, confirmationText } = req.body;
    const userId = req.user._id;

    if (confirmationText !== 'DELETE MY WINTER ARC') {
      return res.status(400).json({ message: 'Confirmation text must match exactly "DELETE MY WINTER ARC"' });
    }

    const user = await User.findById(userId);
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password verification' });
    }

    // Delete all user collections permanently
    await Promise.all([
      User.findByIdAndDelete(userId),
      WinterArc.deleteMany({ userId }),
      Habit.deleteMany({ userId }),
      HabitLog.deleteMany({ userId }),
      DailyCheckIn.deleteMany({ userId }),
      DeveloperSkill.deleteMany({ userId }),
      Project.deleteMany({ userId }),
      JobApplication.deleteMany({ userId }),
      Goal.deleteMany({ userId }),
      Achievement.deleteMany({ userId }),
      Review.deleteMany({ userId }),
      Reminder.deleteMany({ userId }),
      UserSettings.deleteMany({ userId })
    ]);

    res.json({ message: 'Account and all associated Winter Arc data permanently deleted.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { exportUserDataJson, exportUserDataCsv, importUserData, deleteAccount };
