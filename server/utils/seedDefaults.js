const Habit = require('../models/Habit');
const DeveloperSkill = require('../models/DeveloperSkill');
const Reminder = require('../models/Reminder');
const UserSettings = require('../models/UserSettings');
const WinterArc = require('../models/WinterArc');

const DEFAULT_HABITS = [
  // MORNING
  { title: 'Wake Up On Time', category: 'MORNING', targetText: '7:00 AM', targetValue: 7, targetUnit: 'time', preferredTime: '07:00', order: 1, isDefault: true, color: '#f59e0b', icon: 'Sun' },
  { title: 'No Phone First 30 Minutes', category: 'MORNING', targetText: '30 mins', targetValue: 30, targetUnit: 'minutes', preferredTime: '07:15', order: 2, isDefault: true, color: '#3b82f6', icon: 'SmartphoneOff' },
  { title: 'Morning Walk / Stretch', category: 'MORNING', targetText: '15 mins', targetValue: 15, targetUnit: 'minutes', preferredTime: '07:30', order: 3, isDefault: true, color: '#10b981', icon: 'Activity' },
  
  // STUDY
  { title: 'BCA Study', category: 'STUDY', targetText: '1 hour', targetValue: 1, targetUnit: 'hours', preferredTime: '08:00', order: 4, isDefault: true, color: '#8b5cf6', icon: 'BookOpen' },
  
  // DEVELOPMENT
  { title: 'Full Stack Coding', category: 'DEVELOPMENT', targetText: '3 hours', targetValue: 3, targetUnit: 'hours', preferredTime: '10:00', order: 5, isDefault: true, color: '#ec4899', icon: 'Code' },
  { title: 'Project Development', category: 'DEVELOPMENT', targetText: '1.5 hours', targetValue: 1.5, targetUnit: 'hours', preferredTime: '14:00', order: 6, isDefault: true, color: '#06b6d4', icon: 'Layers' },
  
  // CAREER
  { title: 'DSA / Interview Preparation', category: 'CAREER', targetText: '30 minutes', targetValue: 30, targetUnit: 'minutes', preferredTime: '16:00', order: 7, isDefault: true, color: '#f97316', icon: 'Brain' },
  { title: 'English Practice', category: 'CAREER', targetText: '20 minutes', targetValue: 20, targetUnit: 'minutes', preferredTime: '17:00', order: 8, isDefault: true, color: '#14b8a6', icon: 'MessageSquare' },
  
  // HEALTH
  { title: 'Exercise / Walk', category: 'HEALTH', targetText: '30 minutes', targetValue: 30, targetUnit: 'minutes', preferredTime: '18:00', order: 9, isDefault: true, color: '#ef4444', icon: 'Dumbbell' },
  { title: 'Drink Enough Water', category: 'HEALTH', targetText: '3 Liters', targetValue: 3, targetUnit: 'liters', preferredTime: '12:00', order: 10, isDefault: true, color: '#3b82f6', icon: 'Droplets' },
  
  // DIGITAL DISCIPLINE
  { title: 'Limit Social Media', category: 'DIGITAL DISCIPLINE', targetText: '< 45 mins', targetValue: 45, targetUnit: 'minutes', preferredTime: '19:00', order: 11, isDefault: true, color: '#6366f1', icon: 'ShieldAlert' },
  
  // NIGHT
  { title: 'Daily Review', category: 'NIGHT', targetText: '15 mins', targetValue: 15, targetUnit: 'minutes', preferredTime: '21:30', order: 12, isDefault: true, color: '#a855f7', icon: 'FileText' },
  { title: 'Plan Tomorrow', category: 'NIGHT', targetText: '10 mins', targetValue: 10, targetUnit: 'minutes', preferredTime: '22:00', order: 13, isDefault: true, color: '#64748b', icon: 'Calendar' },
  { title: 'Sleep On Time', category: 'NIGHT', targetText: '11:00 PM', targetValue: 23, targetUnit: 'time', preferredTime: '22:30', order: 14, isDefault: true, color: '#1e293b', icon: 'Moon' }
];

const DEFAULT_SKILLS = [
  { skillName: 'JavaScript', status: 'Practicing', category: 'Frontend', topics: [{ title: 'ES6+ Features & Async/Await', status: 'Completed', practiceCompleted: true }, { title: 'Event Loop & Promises', status: 'Learning', practiceCompleted: false }] },
  { skillName: 'React', status: 'Practicing', category: 'Frontend', topics: [{ title: 'Hooks & Context API', status: 'Completed', practiceCompleted: true }, { title: 'State Management & Custom Hooks', status: 'Practicing', practiceCompleted: true }] },
  { skillName: 'Node.js', status: 'Learning', category: 'Backend', topics: [{ title: 'Event Loop & Modules', status: 'Learning', practiceCompleted: false }] },
  { skillName: 'Express.js', status: 'Learning', category: 'Backend', topics: [{ title: 'Middleware & REST Routing', status: 'Learning', practiceCompleted: false }] },
  { skillName: 'MongoDB', status: 'Learning', category: 'Database', topics: [{ title: 'Mongoose Schemas & Indexing', status: 'Learning', practiceCompleted: false }] },
  { skillName: 'REST API', status: 'Practicing', category: 'Backend', topics: [{ title: 'CRUD API Architecture & Status Codes', status: 'Practicing', practiceCompleted: true }] },
  { skillName: 'Git', status: 'Project Ready', category: 'Tools', topics: [{ title: 'Branching, Merging & Rebase', status: 'Completed', practiceCompleted: true }] },
  { skillName: 'GitHub', status: 'Project Ready', category: 'Tools', topics: [{ title: 'Pull Requests & Open Source Setup', status: 'Completed', practiceCompleted: true }] },
  { skillName: 'Authentication', status: 'Learning', category: 'Backend', topics: [{ title: 'JWT Tokens & Password Hashing', status: 'Learning', practiceCompleted: false }] },
  { skillName: 'Deployment', status: 'Not Started', category: 'DevOps', topics: [{ title: 'Vercel, Render & Environment Variables', status: 'Not Started', practiceCompleted: false }] },
  { skillName: 'DSA', status: 'Practicing', category: 'Computer Science', topics: [{ title: 'Arrays & Strings', status: 'Practicing', practiceCompleted: true }, { title: 'Linked Lists & Trees', status: 'Learning', practiceCompleted: false }] },
  { skillName: 'Interview Preparation', status: 'Learning', category: 'Career', topics: [{ title: 'Core Web Concepts & Behavioral Questions', status: 'Learning', practiceCompleted: false }] }
];

const DEFAULT_REMINDERS = [
  { title: 'Wake Up', time: '07:00 AM', category: 'MORNING', isEnabled: true },
  { title: 'BCA Study', time: '08:00 AM', category: 'STUDY', isEnabled: true },
  { title: 'Full Stack Coding', time: '10:00 AM', category: 'DEVELOPMENT', isEnabled: true },
  { title: 'Exercise / Walk', time: '06:00 PM', category: 'HEALTH', isEnabled: true },
  { title: 'Daily Review', time: '09:30 PM', category: 'NIGHT', isEnabled: true },
  { title: 'Plan Tomorrow', time: '10:30 PM', category: 'NIGHT', isEnabled: true }
];

const seedDefaultsForUser = async (userId, startDate = new Date()) => {
  // 1. Ensure WinterArc record exists
  let winterArc = await WinterArc.findOne({ userId });
  if (!winterArc) {
    winterArc = await WinterArc.create({
      userId,
      startDate,
      hasEndDate: false,
      isActive: true
    });
  }

  // 2. Ensure UserSettings exist
  let settings = await UserSettings.findOne({ userId });
  if (!settings) {
    settings = await UserSettings.create({
      userId,
      streakThresholdPercent: 80,
      theme: 'dark'
    });
  }

  // 3. Ensure Default Habits exist
  const existingHabits = await Habit.find({ userId });
  if (existingHabits.length === 0) {
    const habitsToCreate = DEFAULT_HABITS.map(h => ({ ...h, userId }));
    await Habit.insertMany(habitsToCreate);
  }

  // 4. Ensure Developer Skills exist
  const existingSkills = await DeveloperSkill.find({ userId });
  if (existingSkills.length === 0) {
    const skillsToCreate = DEFAULT_SKILLS.map(s => ({ ...s, userId }));
    await DeveloperSkill.insertMany(skillsToCreate);
  }

  // 5. Ensure Default Reminders exist
  const existingReminders = await Reminder.find({ userId });
  if (existingReminders.length === 0) {
    const remindersToCreate = DEFAULT_REMINDERS.map(r => ({ ...r, userId }));
    await Reminder.insertMany(remindersToCreate);
  }

  return { winterArc, settings };
};

module.exports = { seedDefaultsForUser };
