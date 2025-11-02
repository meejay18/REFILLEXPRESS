const express = require('express');
const { authentication } = require ('../middleware/authentication');
const { getReviews, getReviewSummary, createReview, getReviewStats, getVendorReviews } = require('../controller/reviewController');
const router = express.Router()

router.get('/reviews', getReviews)
router.post('/vendor/reviews/:vendorId', authentication,createReview)
router.get('/reviews/summary', getReviewSummary)
router.get('/reviews/stats', getReviewStats)
router.post('/vendors/:vendorId/reviews', authentication,getVendorReviews)



module.exports = router