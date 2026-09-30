const JobApplication = require('../models/JobApplication');
const { checkAndUnlockAchievements } = require('./achievementController');

// @desc    Get all job applications
// @route   GET /api/job-applications
// @access  Private
const getApplications = async (req, res) => {
  try {
    let apps = await JobApplication.find({ userId: req.user._id }).sort({ applicationDate: -1 });
    
    // Seed sample job applications if empty
    if (apps.length === 0) {
      const sample1 = await JobApplication.create({
        userId: req.user._id,
        company: 'TechCorp Solutions',
        role: 'Junior Full Stack Developer',
        location: 'Remote / Ahmedabad',
        applicationDate: new Date(),
        status: 'Applied',
        jobUrl: 'https://linkedin.com/jobs/view/sample-1',
        notes: 'Applied via LinkedIn. Tailored resume for React & Node stack.'
      });

      const sample2 = await JobApplication.create({
        userId: req.user._id,
        company: 'WebCraft Studio',
        role: 'Frontend React Developer',
        location: 'Remote',
        applicationDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: 'Interview',
        jobUrl: 'https://webcraft.careers/dev-2026',
        notes: 'Round 1 technical interview scheduled next Tuesday.'
      });

      apps = [sample1, sample2];
    }

    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create job application
// @route   POST /api/job-applications
// @access  Private
const createApplication = async (req, res) => {
  try {
    const { company, role, location, applicationDate, status, jobUrl, notes } = req.body;

    if (!company || !role) {
      return res.status(400).json({ message: 'Company name and role are required' });
    }

    const app = await JobApplication.create({
      userId: req.user._id,
      company,
      role,
      location: location || 'Remote',
      applicationDate: applicationDate || new Date(),
      status: status || 'Saved',
      jobUrl: jobUrl || '',
      notes: notes || ''
    });

    await checkAndUnlockAchievements(req.user._id);

    res.status(201).json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update job application
// @route   PUT /api/job-applications/:id
// @access  Private
const updateApplication = async (req, res) => {
  try {
    const app = await JobApplication.findOne({ _id: req.params.id, userId: req.user._id });
    if (!app) return res.status(404).json({ message: 'Job application not found' });

    if (req.body.company) app.company = req.body.company;
    if (req.body.role) app.role = req.body.role;
    if (req.body.location !== undefined) app.location = req.body.location;
    if (req.body.applicationDate) app.applicationDate = req.body.applicationDate;
    if (req.body.status) app.status = req.body.status;
    if (req.body.jobUrl !== undefined) app.jobUrl = req.body.jobUrl;
    if (req.body.notes !== undefined) app.notes = req.body.notes;

    const updated = await app.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete job application
// @route   DELETE /api/job-applications/:id
// @access  Private
const deleteApplication = async (req, res) => {
  try {
    const app = await JobApplication.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!app) return res.status(404).json({ message: 'Job application not found' });
    res.json({ message: 'Job application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getApplications, createApplication, updateApplication, deleteApplication };
