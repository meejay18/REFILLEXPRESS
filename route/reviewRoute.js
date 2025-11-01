const express = require('express');
const { authentication } = require ('../middleware/authentication');
const { getReviews, getReviewSummary, createReview, getReviewStats } = require('../controller/reviewController');
const router = express.Router()

router.get('/review', getReviews)
router.post('/review', authentication,createReview)
router.get('/reviewSummary', getReviewSummary)
router.get('/reviewStats', getReviewStats)



module.exports = router