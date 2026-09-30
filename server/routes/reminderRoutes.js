const express = require('express');
const router = express.Router();
const { getReminders, createReminder, updateReminder, deleteReminder } = require('../controllers/reminderController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getReminders);
router.post('/', protect, createReminder);
router.put('/:id', protect, updateReminder);
router.delete('/:id', protect, deleteReminder);

module.exports = router;
