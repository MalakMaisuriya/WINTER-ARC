const Achievement = require('../models/Achievement');
const DailyCheckIn = require('../models/DailyCheckIn');
const Project = require('../models/Project');
const JobApplication = require('../models/JobApplication');
const { computeStreakStats } = require('./dashboardController');

const BADGE_DEFINITIONS = {
  streak_7: { title: '7 Day Streak', description: 'Maintained 7 consecutive successful days', icon: 'Flame' },
  streak_30: { title: '30 Day Streak', description: 'Achieved a massive 30-day streak in Winter Arc', icon: 'Flame' },
  streak_60: { title: '60 Day Streak', description: '60 continuous days of consistency and growth', icon: 'Flame' },
  streak_90: { title: '90 Day Streak', description: 'Mastered the 90-day Winter Arc challenge!', icon: 'Flame' },
  coding_50h: { title: '50 Coding Hours', description: 'Logged 50+ total hours of full stack coding', icon: 'Code' },
  coding_100h: { title: '100 Coding Hours', description: 'Logged 100+ total hours of full stack coding', icon: 'Code' },
  coding_250h: { title: '250 Coding Hours', description: 'Logged 250+ total hours of coding mastery', icon: 'Code' },
  study_30d: { title: '30 Study Days', description: 'Completed BCA study sessions on 30 distinct days', icon: 'BookOpen' },
  workout_30d: { title: '30 Workout Days', description: 'Stayed physically active for 30 workout days', icon: 'Dumbbell' },
  first_project: { title: 'First Project Completed', description: 'Completed a full stack project development', icon: 'Rocket' },
  first_job_app: { title: 'First Job Application', description: 'Submitted first job application for full stack role', icon: 'Briefcase' },
  monthly_80: { title: '80% Monthly Completion', description: 'Maintained over 80% habit completion for a full month', icon: 'Target' }
};

const unlockBadge = async (userId, badgeKey) => {
  const existing = await Achievement.findOne({ userId, badgeKey });
  if (!existing && BADGE_DEFINITIONS[badgeKey]) {
    const def = BADGE_DEFINITIONS[badgeKey];
    await Achievement.create({
      userId,
      badgeKey,
      title: def.title,
      description: def.description,
      icon: def.icon,
      unlockedAt: new Date()
    });
  }
};

const checkAndUnlockAchievements = async (userId) => {
  // 1. Streak check
  const streaks = await computeStreakStats(userId);
  if (streaks.longestStreak >= 7) await unlockBadge(userId, 'streak_7');
  if (streaks.longestStreak >= 30) await unlockBadge(userId, 'streak_30');
  if (streaks.longestStreak >= 60) await unlockBadge(userId, 'streak_60');
  if (streaks.longestStreak >= 90) await unlockBadge(userId, 'streak_90');

  // 2. Check-in totals check
  const checkIns = await DailyCheckIn.find({ userId });
  let totalCoding = 0;
  let studyDays = 0;
  let workoutDays = 0;

  checkIns.forEach(ci => {
    totalCoding += ci.codingHours || 0;
    if ((ci.studyHours || 0) > 0) studyDays++;
    if ((ci.workoutMinutes || 0) > 0) workoutDays++;
  });

  if (totalCoding >= 50) await unlockBadge(userId, 'coding_50h');
  if (totalCoding >= 100) await unlockBadge(userId, 'coding_100h');
  if (totalCoding >= 250) await unlockBadge(userId, 'coding_250h');
  if (studyDays >= 30) await unlockBadge(userId, 'study_30d');
  if (workoutDays >= 30) await unlockBadge(userId, 'workout_30d');

  // 3. Project check
  const completedProjects = await Project.countDocuments({ userId, status: 'Completed' });
  if (completedProjects >= 1) await unlockBadge(userId, 'first_project');

  // 4. Job App check
  const jobApps = await JobApplication.countDocuments({ userId });
  if (jobApps >= 1) await unlockBadge(userId, 'first_job_app');

  // 5. Monthly completion
  if (streaks.monthlyStreak >= 24) await unlockBadge(userId, 'monthly_80');
};

// @desc    Get user achievements
// @route   GET /api/achievements
// @access  Private
const getAchievements = async (req, res) => {
  try {
    await checkAndUnlockAchievements(req.user._id);

    const unlocked = await Achievement.find({ userId: req.user._id });
    const unlockedMap = {};
    unlocked.forEach(a => {
      unlockedMap[a.badgeKey] = a;
    });

    const allBadges = Object.keys(BADGE_DEFINITIONS).map(key => {
      const def = BADGE_DEFINITIONS[key];
      const isUnlocked = Boolean(unlockedMap[key]);
      return {
        badgeKey: key,
        title: def.title,
        description: def.description,
        icon: def.icon,
        isUnlocked,
        unlockedAt: isUnlocked ? unlockedMap[key].unlockedAt : null
      };
    });

    res.json(allBadges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAchievements, checkAndUnlockAchievements };
