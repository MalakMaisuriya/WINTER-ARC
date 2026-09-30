const express = require('express');
const router = express.Router();
const { getWinterArc, startWinterArc } = require('../controllers/winterArcController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getWinterArc);
router.post('/start', protect, startWinterArc);

module.exports = router;
