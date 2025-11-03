const express = require('express');
const { authentication } = require ('../middleware/authentication');
const { getReviews, getReviewSummary, createReview, getReviewStats, getVendorReviews } = require('../controller/reviewController');
const router = express.Router()



/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Retrieve all reviews
 *     description: Returns a list of all reviews including associated user and vendor details.
 *     tags:
 *       - Reviews
 *     responses:
 *       200:
 *         description: Reviews fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reviews fetched successfully
 *                 reviews:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: 5cb7de6c-2d8e-4234-a53f-fa80942ec9c2
 *                       rating:
 *                         type: integer
 *                         example: 4
 *                       message:
 *                         type: string
 *                         example: Great vendor, timely delivery!
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-11-03T14:06:00Z
 *                       user:
 *                         type: object
 *                         properties:
 *                           firstName:
 *                             type: string
 *                             example: Martins
 *                           lastName:
 *                             type: string
 *                             example: Okoro
 *                       vendor:
 *                         type: object
 *                         properties:
 *                           businessName:
 *                             type: string
 *                             example: Martins Gas Depot
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

router.get('/reviews', getReviews)


/**
 * @swagger
 * /vendors/{vendorId}/reviews:
 *   post:
 *     summary: Submit a review for a vendor
 *     description: Allows an authenticated user to submit a review for a specific vendor.
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vendorId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the vendor being reviewed
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - message
 *             properties:
 *               rating:
 *                 type: integer
 *                 example: 5
 *               message:
 *                 type: string
 *                 example: Excellent service and fast delivery!
 *     responses:
 *       201:
 *         description: Review submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   example: 5cb7de6c-2d8e-4234-a53f-fa80942ec9c2
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Review submitted successfully.
 *       400:
 *         description: Missing or invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Rating and message are required
 *       404:
 *         description: User or vendor not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vendor not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

router.post('/vendor/reviews/:vendorId', authentication,createReview)




/**
 * @swagger
 * /reviews/summary:
 *   get:
 *     summary: Get review summary
 *     description: Returns the total number of reviews and a breakdown of how many reviews fall into each rating (1–5).
 *     tags:
 *       - Reviews
 *     responses:
 *       200:
 *         description: Review summary fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalReviews:
 *                   type: integer
 *                   example: 128
 *                 ratingDistribution:
 *                   type: object
 *                   properties:
 *                     1:
 *                       type: integer
 *                       example: 5
 *                     2:
 *                       type: integer
 *                       example: 12
 *                     3:
 *                       type: integer
 *                       example: 30
 *                     4:
 *                       type: integer
 *                       example: 40
 *                     5:
 *                       type: integer
 *                       example: 41
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

router.get('/reviews/summary', getReviewSummary)






/**
 * @swagger
 * /reviews/stats:
 *   get:
 *     summary: Get review statistics
 *     description: Returns the average rating, percentage breakdown of ratings, and the last updated timestamp.
 *     tags:
 *       - Reviews
 *     responses:
 *       200:
 *         description: Review statistics fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 averageRating:
 *                   type: number
 *                   example: 4.2
 *                 percentageBreakdown:
 *                   type: object
 *                   properties:
 *                     1:
 *                       type: string
 *                       example: "3.1"
 *                     2:
 *                       type: string
 *                       example: "7.8"
 *                     3:
 *                       type: string
 *                       example: "22.5"
 *                     4:
 *                       type: string
 *                       example: "35.0"
 *                     5:
 *                       type: string
 *                       example: "31.6"
 *                 lastUpdated:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-11-03T14:10:00Z
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */


router.get('/reviews/stats', getReviewStats)
// router.get('/vendors/:vendorId/reviews', authentication,getVendorReviews)



module.exports = router