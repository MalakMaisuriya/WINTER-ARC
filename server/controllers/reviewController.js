const Review = require('../models/Review');
const HabitLog = require('../models/HabitLog');
const DailyCheckIn = require('../models/DailyCheckIn');
const { getTodayString } = require('../utils/dateUtils');

// Helper to calculate date range metrics
const calculatePeriodMetrics = async (userId, startDate, endDate) => {
  const checkIns = await DailyCheckIn.find({
    userId,
    date: { $gte: startDate, $lte: endDate }
  });

  const logs = await HabitLog.find({
    userId,
    date: { $gte: startDate, $lte: endDate }
  });

  const totalLogs = logs.length;
  const completedLogs = logs.filter(l => l.status === 'completed').length;
  const completionRate = totalLogs > 0 ? Math.round((completedLogs / totalLogs) * 100) : 0;

  let codingHours = 0;
  let studyHours = 0;
  let workoutMinutes = 0;
  let sleepTotal = 0;
  let prodTotal = 0;
  let checkInCount = checkIns.length;

  checkIns.forEach(ci => {
    codingHours += ci.codingHours || 0;
    studyHours += ci.studyHours || 0;
    workoutMinutes += ci.workoutMinutes || 0;
    sleepTotal += ci.sleepHours || 0;
    prodTotal += ci.productivity || 0;
  });

  const averageSleep = checkInCount > 0 ? Number((sleepTotal / checkInCount).toFixed(1)) : 0;
  const averageProductivity = checkInCount > 0 ? Number((prodTotal / checkInCount).toFixed(1)) : 0;

  return {
    completionRate,
    codingHours,
    studyHours,
    workoutMinutes,
    averageSleep,
    averageProductivity
  };
};

// @desc    Get all reviews for user
// @route   GET /api/reviews
// @access  Private
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user._id }).sort({ startDate: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create/Save Weekly or Monthly Review
// @route   POST /api/reviews
// @access  Private
const saveReview = async (req, res) => {
  try {
    const {
      type,
      periodIdentifier,
      startDate,
      endDate,
      bestHabit,
      weakestHabit,
      whatWentWell,
      whatWentWrong,
      improvements,
      mainGoalNextPeriod,
      monthlyReflection,
      nextMonthGoals
    } = req.body;

    if (!type || !periodIdentifier || !startDate || !endDate) {
      return res.status(400).json({ message: 'Type, period identifier, and dates are required' });
    }

    const sDate = getTodayString(new Date(startDate));
    const eDate = getTodayString(new Date(endDate));

    const metrics = await calculatePeriodMetrics(req.user._id, sDate, eDate);

    let review = await Review.findOne({
      userId: req.user._id,
      type,
      periodIdentifier
    });

    if (!review) {
      review = new Review({
        userId: req.user._id,
        type,
        periodIdentifier,
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      });
    }

    review.completionRate = metrics.completionRate;
    review.codingHours = metrics.codingHours;
    review.studyHours = metrics.studyHours;
    review.workoutMinutes = metrics.workoutMinutes;
    review.averageSleep = metrics.averageSleep;
    review.averageProductivity = metrics.averageProductivity;

    if (bestHabit !== undefined) review.bestHabit = bestHabit;
    if (weakestHabit !== undefined) review.weakestHabit = weakestHabit;
    if (whatWentWell !== undefined) review.whatWentWell = whatWentWell;
    if (whatWentWrong !== undefined) review.whatWentWrong = whatWentWrong;
    if (improvements !== undefined) review.improvements = improvements;
    if (mainGoalNextPeriod !== undefined) review.mainGoalNextPeriod = mainGoalNextPeriod;
    if (monthlyReflection !== undefined) review.monthlyReflection = monthlyReflection;
    if (nextMonthGoals !== undefined) review.nextMonthGoals = nextMonthGoals;

    const saved = await review.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getReviews, saveReview };
