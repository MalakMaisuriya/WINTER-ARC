const express = require('express');
const router = express.Router();
const { getSkills, updateSkill, addTopic, updateTopic } = require('../controllers/developerController');
const { protect } = require('../middleware/auth');

router.get('/skills', protect, getSkills);
router.put('/skills/:id', protect, updateSkill);
router.post('/skills/:id/topics', protect, addTopic);
router.put('/skills/:id/topics/:topicId', protect, updateTopic);

module.exports = router;
