const DailyCheckIn = require('../models/DailyCheckIn');
const { getTodayString } = require('../utils/dateUtils');
const { checkAndUnlockAchievements } = require('./achievementController');

// @desc    Get Daily Check-In for a date
// @route   GET /api/checkin
// @access  Private
const getCheckIn = async (req, res) => {
  try {
    const targetDate = req.query.date || getTodayString();
    let checkIn = await DailyCheckIn.findOne({
      userId: req.user._id,
      date: targetDate
    });

    if (!checkIn) {
      checkIn = {
        date: targetDate,
        mood: 'good',
        energy: 7,
        productivity: 7,
        sleepHours: 7,
        codingHours: 0,
        studyHours: 0,
        workoutMinutes: 0,
        screenTime: 0,
        instagramTime: 0,
        youtubeTime: 0,
        gamingTime: 0,
        accomplishments: '',
        improvements: '',
        topPriorityTomorrow: ''
      };
    }

    res.json(checkIn);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Save/Update Daily Check-In
// @route   POST /api/checkin
// @access  Private
const saveCheckIn = async (req, res) => {
  try {
    const targetDate = req.body.date || getTodayString();

    let checkIn = await DailyCheckIn.findOne({
      userId: req.user._id,
      date: targetDate
    });

    if (!checkIn) {
      checkIn = new DailyCheckIn({
        userId: req.user._id,
        date: targetDate
      });
    }

    if (req.body.mood) checkIn.mood = req.body.mood;
    if (req.body.energy !== undefined) checkIn.energy = req.body.energy;
    if (req.body.productivity !== undefined) checkIn.productivity = req.body.productivity;
    if (req.body.sleepHours !== undefined) checkIn.sleepHours = req.body.sleepHours;
    if (req.body.codingHours !== undefined) checkIn.codingHours = req.body.codingHours;
    if (req.body.studyHours !== undefined) checkIn.studyHours = req.body.studyHours;
    if (req.body.workoutMinutes !== undefined) checkIn.workoutMinutes = req.body.workoutMinutes;
    if (req.body.screenTime !== undefined) checkIn.screenTime = req.body.screenTime;
    if (req.body.instagramTime !== undefined) checkIn.instagramTime = req.body.instagramTime;
    if (req.body.youtubeTime !== undefined) checkIn.youtubeTime = req.body.youtubeTime;
    if (req.body.gamingTime !== undefined) checkIn.gamingTime = req.body.gamingTime;
    if (req.body.accomplishments !== undefined) checkIn.accomplishments = req.body.accomplishments;
    if (req.body.improvements !== undefined) checkIn.improvements = req.body.improvements;
    if (req.body.topPriorityTomorrow !== undefined) checkIn.topPriorityTomorrow = req.body.topPriorityTomorrow;

    const saved = await checkIn.save();

    // Trigger achievement checks
    checkAndUnlockAchievements(req.user._id).catch(err => console.error('Achievement check error:', err));

    res.json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCheckIn, saveCheckIn };
