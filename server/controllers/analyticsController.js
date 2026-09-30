const DailyCheckIn = require('../models/DailyCheckIn');
const HabitLog = require('../models/HabitLog');
const Habit = require('../models/Habit');
const { getTodayString } = require('../utils/dateUtils');
const { computeStreakStats } = require('./dashboardController');

// @desc    Get detailed analytics data
// @route   GET /api/analytics
// @access  Private
const getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    // Generate last 30 days date strings
    const todayDateObj = new Date();
    const last30Days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(todayDateObj);
      d.setDate(d.getDate() - i);
      last30Days.push(getTodayString(d));
    }

    // Fetch Daily Check-Ins for last 30 days
    const checkIns = await DailyCheckIn.find({
      userId,
      date: { $in: last30Days }
    });

    const checkInMap = {};
    checkIns.forEach(ci => {
      checkInMap[ci.date] = ci;
    });

    // Fetch Habit Logs for last 30 days
    const habitLogs = await HabitLog.find({
      userId,
      date: { $in: last30Days }
    });

    const logsByDate = {};
    habitLogs.forEach(l => {
      if (!logsByDate[l.date]) logsByDate[l.date] = { completed: 0, total: 0 };
      logsByDate[l.date].total += 1;
      if (l.status === 'completed') logsByDate[l.date].completed += 1;
    });

    const activeHabitCount = await Habit.countDocuments({ userId, isActive: true });

    // Build daily data series for charts
    let totalCoding = 0;
    let totalStudy = 0;
    let totalWorkout = 0;
    let totalSleep = 0;
    let totalProd = 0;
    let totalEnergy = 0;
    let totalScreen = 0;
    let checkInCount = 0;

    const chartData = last30Days.map(dateStr => {
      const ci = checkInMap[dateStr] || {};
      const hl = logsByDate[dateStr] || { completed: 0, total: 0 };
      const expectedTotal = Math.max(hl.total, activeHabitCount || 1);
      const completionRate = Math.round((hl.completed / expectedTotal) * 100);

      const coding = ci.codingHours || 0;
      const study = ci.studyHours || 0;
      const workout = ci.workoutMinutes || 0;
      const sleep = ci.sleepHours || 0;
      const prod = ci.productivity || 0;
      const energy = ci.energy || 0;
      const screen = ci.screenTime || 0;

      if (checkInMap[dateStr]) {
        totalCoding += coding;
        totalStudy += study;
        totalWorkout += workout;
        totalSleep += sleep;
        totalProd += prod;
        totalEnergy += energy;
        totalScreen += screen;
        checkInCount += 1;
      }

      return {
        date: dateStr,
        displayDate: dateStr.substring(5), // MM-DD
        completionRate,
        codingHours: coding,
        studyHours: study,
        workoutMinutes: workout,
        sleepHours: sleep,
        productivity: prod,
        energy: energy,
        screenTime: screen
      };
    });

    const streaks = await computeStreakStats(userId);

    const averages = {
      avgCodingHours: checkInCount > 0 ? (totalCoding / checkInCount).toFixed(1) : 0,
      avgStudyHours: checkInCount > 0 ? (totalStudy / checkInCount).toFixed(1) : 0,
      avgWorkoutMinutes: checkInCount > 0 ? Math.round(totalWorkout / checkInCount) : 0,
      avgSleep: checkInCount > 0 ? (totalSleep / checkInCount).toFixed(1) : 0,
      avgProductivity: checkInCount > 0 ? (totalProd / checkInCount).toFixed(1) : 0,
      avgEnergy: checkInCount > 0 ? (totalEnergy / checkInCount).toFixed(1) : 0,
      avgScreenTime: checkInCount > 0 ? Math.round(totalScreen / checkInCount) : 0,
      totalCodingHours: totalCoding,
      totalStudyHours: totalStudy,
      totalWorkoutMinutes: totalWorkout
    };

    // Category breakdown
    const categoryStats = await HabitLog.aggregate([
      { $match: { userId: req.user._id, status: 'completed' } },
      { $lookup: { from: 'habits', localField: 'habitId', foreignField: '_id', as: 'habit' } },
      { $unwind: '$habit' },
      { $group: { _id: '$habit.category', count: { $sum: 1 } } }
    ]);

    res.json({
      chartData,
      last7Days: chartData.slice(23),
      averages,
      streaks,
      categoryStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnalytics };
