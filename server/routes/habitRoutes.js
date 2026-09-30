const express = require('express');
const router = express.Router();
const {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  logHabitDaily,
  getHabitHistory
} = require('../controllers/habitController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getHabits);
router.post('/', protect, createHabit);
router.put('/:id', protect, updateHabit);
router.delete('/:id', protect, deleteHabit);
router.post('/:id/log', protect, logHabitDaily);
router.get('/history', protect, getHabitHistory);

module.exports = router;
