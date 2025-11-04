const express = require('express');
const { authentication, vendorAuthentication } = require ('../middleware/authentication')
const { getVendorAnalytics, getReviewSummary, getOrderStats } = require('../controller/analyticsController');
const router = express.Router();



/**
 * @swagger
 * /vendor/{vendorId}/analytics:
 *   get:
 *     summary: Get vendor analytics overview
 *     tags: [Vendor Dashboard]
 *     description: |
 *       Retrieves key performance analytics for a specific vendor, including total and completed orders, completion rate, 
 *       review summary, average rating, and current month revenue.
 *     parameters:
 *       - in: path
 *         name: vendorId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique ID of the vendor
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vendor analytics fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               totalOrders: 120
 *               completedOrders: 98
 *               completionRate: "81.7"
 *               totalReviews: 25
 *               averageRating: "4.5"
 *               ratingDistribution:
 *                 1: 0
 *                 2: 1
 *                 3: 3
 *                 4: 8
 *                 5: 13
 *               monthlyRevenue: 250000
 *       400:
 *         description: Invalid vendor ID or bad request
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid vendor ID provided"
 *       404:
 *         description: Vendor not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Vendor not found"
 *       500:
 *         description: Server error while retrieving analytics
 *         content:
 *           application/json:
 *             example:
 *               message: "An unexpected error occurred while fetching vendor analytics"
 */

router.get('/vendor/:vendorId/analytics',vendorAuthentication, getVendorAnalytics);



/**
 * @swagger
 * /vendor/{vendorId}/reviews/summary:
 *   get:
 *     summary: Get vendor review summary
 *     tags: [Vendor Dashboard]
 *     description: |
 *       Fetches summarized review data for a vendor, including total number of reviews, 
 *       average rating, and distribution across rating levels.
 *     parameters:
 *       - in: path
 *         name: vendorId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique ID of the vendor
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Review summary fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               totalReviews: 45
 *               averageRating: "4.3"
 *               ratingDistribution:
 *                 1: 2
 *                 2: 3
 *                 3: 7
 *                 4: 12
 *                 5: 21
 *       400:
 *         description: Invalid vendor ID or missing parameter
 *         content:
 *           application/json:
 *             example:
 *               message: "Vendor ID is required"
 *       404:
 *         description: Vendor not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Vendor not found"
 *       500:
 *         description: Server error while retrieving review summary
 *         content:
 *           application/json:
 *             example:
 *               message: "An unexpected error occurred while fetching review summary"
 */

router.get('/vendor/:vendorId/reviews/summary',vendorAuthentication, getReviewSummary);


/**
 * @swagger
 * /vendor/{vendorId}/orders/stats:
 *   get:
 *     summary: Get vendor order statistics
 *     tags: [Vendor Dashboard]
 *     description: |
 *       Provides statistical insights into vendor orders, such as total, pending, completed, and cancelled orders,
 *       along with total revenue generated and average order value.
 *     parameters:
 *       - in: path
 *         name: vendorId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique ID of the vendor
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vendor order statistics retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               totalOrders: 150
 *               pendingOrders: 20
 *               completedOrders: 110
 *               cancelledOrders: 20
 *               totalRevenue: 500000
 *               averageOrderValue: 4545.45
 *       400:
 *         description: Invalid vendor ID or missing data
 *         content:
 *           application/json:
 *             example:
 *               message: "Vendor ID is required"
 *       404:
 *         description: Vendor not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Vendor not found"
 *       500:
 *         description: Server error while fetching order statistics
 *         content:
 *           application/json:
 *             example:
 *               message: "An unexpected error occurred while retrieving vendor order statistics"
 */


router.get('/vendor/:vendorId/orders/stats', vendorAuthentication , getOrderStats);



module.exports = router