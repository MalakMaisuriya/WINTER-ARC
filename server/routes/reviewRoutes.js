const express = require('express');
const router = express.Router();
const { getReviews, saveReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getReviews);
router.post('/', protect, saveReview);

module.exports = router;
