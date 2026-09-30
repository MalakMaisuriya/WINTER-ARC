const WinterArc = require('../models/WinterArc');
const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');
const DailyCheckIn = require('../models/DailyCheckIn');
const UserSettings = require('../models/UserSettings');
const { calculateWinterArcDay } = require('./winterArcController');
const { getTodayString } = require('../utils/dateUtils');

// Helper to calculate streaks
const computeStreakStats = async (userId) => {
  const settings = await UserSettings.findOne({ userId });
  const threshold = settings ? settings.streakThresholdPercent : 80;

  const activeHabitsCount = await Habit.countDocuments({ userId, isActive: true });
  if (activeHabitsCount === 0) {
    return { currentStreak: 0, longestStreak: 0, weeklyStreak: 0, monthlyStreak: 0 };
  }

  // Get all logs grouped by date
  const logs = await HabitLog.find({ userId });
  const logsByDate = {};
  logs.forEach(log => {
    if (!logsByDate[log.date]) {
      logsByDate[log.date] = { completed: 0, total: 0 };
    }
    logsByDate[log.date].total += 1;
    if (log.status === 'completed') {
      logsByDate[log.date].completed += 1;
    }
  });

  // Collect sorted dates
  const sortedDates = Object.keys(logsByDate).sort();
  if (sortedDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0, weeklyStreak: 0, monthlyStreak: 0 };
  }

  // Map each date to successful (Boolean)
  const successDateMap = {};
  sortedDates.forEach(d => {
    const logInfo = logsByDate[d];
    const totalExpected = Math.max(logInfo.total, activeHabitsCount);
    const completionPercent = (logInfo.completed / totalExpected) * 100;
    successDateMap[d] = completionPercent >= threshold;
  });

  // Calculate current streak working backwards from today / yesterday
  const todayStr = getTodayString();
  const todayDateObj = new Date();
  
  let currentStreak = 0;
  let checkDate = new Date(todayDateObj);

  // Check today first
  let checkStr = getTodayString(checkDate);
  if (successDateMap[checkStr]) {
    currentStreak++;
    checkDate.setDate(checkDate.getDate() - 1);
  } else {
    // If today is not completed yet, check yesterday to keep streak alive
    checkDate.setDate(checkDate.getDate() - 1);
    checkStr = getTodayString(checkDate);
    if (!successDateMap[checkStr]) {
      currentStreak = 0;
    }
  }

  if (currentStreak > 0) {
    while (true) {
      checkStr = getTodayString(checkDate);
      if (successDateMap[checkStr]) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Calculate longest streak across all history
  let longestStreak = 0;
  let tempStreak = 0;

  // Generate date sequence from first logged date to today
  if (sortedDates.length > 0) {
    const firstDateObj = new Date(sortedDates[0]);
    const currDateObj = new Date(todayDateObj);
    currDateObj.setHours(0, 0, 0, 0);

    for (let d = new Date(firstDateObj); d <= currDateObj; d.setDate(d.getDate() + 1)) {
      const ds = getTodayString(d);
      if (successDateMap[ds]) {
        tempStreak++;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    }
  }

  // Weekly & Monthly streaks (success days in last 7 and 30 days)
  let weeklyStreak = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(todayDateObj);
    d.setDate(d.getDate() - i);
    if (successDateMap[getTodayString(d)]) weeklyStreak++;
  }

  let monthlyStreak = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date(todayDateObj);
    d.setDate(d.getDate() - i);
    if (successDateMap[getTodayString(d)]) monthlyStreak++;
  }

  return { currentStreak, longestStreak, weeklyStreak, monthlyStreak };
};

// @desc    Get full main dashboard summary data
// @route   GET /api/dashboard
// @access  Private
const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;
    const todayStr = getTodayString();

    // 1. Winter Arc details
    let arc = await WinterArc.findOne({ userId });
    if (!arc) {
      arc = await WinterArc.create({ userId, startDate: new Date(), hasEndDate: false, isActive: true });
    }
    const currentDay = calculateWinterArcDay(arc.startDate);

    // 2. Active Habits
    const activeHabits = await Habit.find({ userId, isActive: true }).sort({ order: 1 });
    const totalActiveHabits = activeHabits.length;

    // 3. Today's Logs
    const todayLogs = await HabitLog.find({ userId, date: todayStr });
    const completedTodayCount = todayLogs.filter(l => l.status === 'completed').length;
    const missedTodayCount = totalActiveHabits - completedTodayCount;
    const todayProgressPercent = totalActiveHabits > 0 
      ? Math.round((completedTodayCount / totalActiveHabits) * 100) 
      : 0;

    // 4. Overall Historical Stats
    const totalCompletedHabits = await HabitLog.countDocuments({ userId, status: 'completed' });
    const totalMissedHabits = await HabitLog.countDocuments({ userId, status: 'missed' });
    
    // Distinct days logged
    const distinctDays = await HabitLog.distinct('date', { userId, status: 'completed' });
    const totalDaysCompleted = distinctDays.length;

    const overallTotalLogs = totalCompletedHabits + totalMissedHabits;
    const overallCompletionPercent = overallTotalLogs > 0 
      ? Math.round((totalCompletedHabits / overallTotalLogs) * 100) 
      : 0;

    // 5. Streaks
    const streakStats = await computeStreakStats(userId);

    // 6. Today's Check-In summary
    let checkIn = await DailyCheckIn.findOne({ userId, date: todayStr });
    if (!checkIn) {
      checkIn = {
        mood: 'good',
        energy: 7,
        productivity: 7,
        codingHours: 0,
        studyHours: 0,
        workoutMinutes: 0,
        accomplishments: '',
        topPriorityTomorrow: ''
      };
    }

    res.json({
      currentDay,
      winterArcStartDate: arc.startDate,
      goalStatement: arc.goalStatement,
      todayProgress: {
        completed: completedTodayCount,
        total: totalActiveHabits,
        percent: todayProgressPercent
      },
      streaks: streakStats,
      overall: {
        completionPercent: overallCompletionPercent,
        totalCompletedHabits,
        totalMissedHabits,
        totalDaysCompleted
      },
      checkIn
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardData, computeStreakStats };
