const Project = require('../models/Project');
const { checkAndUnlockAchievements } = require('./achievementController');

// @desc    Get all projects for user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    let projects = await Project.find({ userId: req.user._id }).sort({ createdAt: -1 });
    
    // Pre-seed default sample project if none exist yet!
    if (projects.length === 0) {
      const sample = await Project.create({
        userId: req.user._id,
        name: 'Driving School Management System',
        description: 'Comprehensive full-stack web application for driving academy scheduling, student management, and instructor booking.',
        technologies: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS'],
        startDate: new Date(),
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'In Progress',
        githubUrl: 'https://github.com/malakmaisuriya/driving-school-system',
        liveUrl: 'https://drivingschool-demo.vercel.app',
        progressPercent: 65,
        notes: 'Backend API completed. Currently building frontend student dashboard & calendar booking view.'
      });
      projects = [sample];
    }

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  try {
    const { name, description, technologies, startDate, targetDate, status, githubUrl, liveUrl, progressPercent, notes } = req.body;

    if (!name) return res.status(400).json({ message: 'Project name is required' });

    const techArray = Array.isArray(technologies) 
      ? technologies 
      : (technologies || '').split(',').map(t => t.trim()).filter(Boolean);

    const project = await Project.create({
      userId: req.user._id,
      name,
      description: description || '',
      technologies: techArray,
      startDate: startDate || new Date(),
      targetDate: targetDate || null,
      status: status || 'Planning',
      githubUrl: githubUrl || '',
      liveUrl: liveUrl || '',
      progressPercent: progressPercent || 0,
      notes: notes || ''
    });

    if (project.status === 'Completed') {
      await checkAndUnlockAchievements(req.user._id);
    }

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user._id });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (req.body.name) project.name = req.body.name;
    if (req.body.description !== undefined) project.description = req.body.description;
    if (req.body.technologies) {
      project.technologies = Array.isArray(req.body.technologies)
        ? req.body.technologies
        : req.body.technologies.split(',').map(t => t.trim()).filter(Boolean);
    }
    if (req.body.startDate) project.startDate = req.body.startDate;
    if (req.body.targetDate !== undefined) project.targetDate = req.body.targetDate;
    if (req.body.status) project.status = req.body.status;
    if (req.body.githubUrl !== undefined) project.githubUrl = req.body.githubUrl;
    if (req.body.liveUrl !== undefined) project.liveUrl = req.body.liveUrl;
    if (req.body.progressPercent !== undefined) project.progressPercent = req.body.progressPercent;
    if (req.body.notes !== undefined) project.notes = req.body.notes;

    const updated = await project.save();

    if (updated.status === 'Completed') {
      await checkAndUnlockAchievements(req.user._id);
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProjects, createProject, updateProject, deleteProject };
