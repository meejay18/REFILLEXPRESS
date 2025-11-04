const express = require('express');
const { authentication, vendorAuthentication } = require ('../middleware/authentication')
const { getVendorAnalytics, getReviewSummary, getOrderStats } = require('../controller/analyticsController');
const router = express.Router();

router.get('/vendor/:vendorId/analytics',vendorAuthentication, getVendorAnalytics);
router.get('/vendor/:vendorId/reviews/summary',vendorAuthentication, getReviewSummary);
router.get('/vendor/:vendorId/orders/stats', vendorAuthentication , getOrderStats)


module.exports = router