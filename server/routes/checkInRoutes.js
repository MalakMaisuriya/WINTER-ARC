const express = require('express');
const router = express.Router();
const { getCheckIn, saveCheckIn } = require('../controllers/checkInController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getCheckIn);
router.post('/', protect, saveCheckIn);

module.exports = router;
