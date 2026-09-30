const express = require('express');
const router = express.Router();
const { getApplications, createApplication, updateApplication, deleteApplication } = require('../controllers/jobController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getApplications);
router.post('/', protect, createApplication);
router.put('/:id', protect, updateApplication);
router.delete('/:id', protect, deleteApplication);

module.exports = router;
