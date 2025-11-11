const express = require('express');
const { authentication } = require ('../middleware/authentication');
const { getReviews, getReviewSummary, createReview, getReviewStats, getVendorReviews, createUserReview, getVendorReviewSummary } = require('../controller/reviewController');
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
 * /vendor/reviews/{vendorId}:
 *   post:
 *     summary: Submit a review for a vendor
 *     description: Allows an authenticated user to create a review for a specific vendor.
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: vendorId
 *         in: path
 *         required: true
 *         description: ID of the vendor to review
 *         schema:
 *           type: integer
 *           example: 3
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
 *                 type: number
 *                 example: 4.5
 *               message:
 *                 type: string
 *                 example: "The service was excellent and fast!"
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 10
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Review submitted successfully.
 *       400:
 *         description: Missing rating or message
 *       404:
 *         description: User or vendor not found
 *       500:
 *         description: Server error
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


/**
 * @swagger
 * /vendors/{vendorId}/reviews:
 *   post:
 *     summary: Create a review for a vendor
 *     description: Allows an authenticated user to submit a review for a vendor they have previously purchased from.
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vendorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the vendor being reviewed
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
 *                 type: number
 *                 example: 4
 *                 description: Rating between 1 and 5
 *               message:
 *                 type: string
 *                 example: Excellent service and fast delivery.
 *     responses:
 *       201:
 *         description: Review submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Review submitted successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     reviewId:
 *                       type: integer
 *                       example: 15
 *                     vendorId:
 *                       type: integer
 *                       example: 3
 *                     rating:
 *                       type: integer
 *                       example: 5
 *                     message:
 *                       type: string
 *                       example: Great quality product and professional service.
 *       400:
 *         description: Bad Request (missing fields or invalid input)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Rating and message are required.
 *       403:
 *         description: Forbidden (user hasn’t purchased from the vendor)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: You can only review vendors you have purchased from.
 *       404:
 *         description: Not Found (user or vendor not found)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Vendor not found.
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: An error occurred while submitting the review.
 */

router.post('/vendors/:vendorId/reviews', authentication, createUserReview)




/**
 * @swagger
 * /vendors/{vendorId}/reviews:
 *   get:
 *     summary: Get all reviews for a vendor
 *     description: Fetches all reviews for a specific vendor, including the reviewer's name and the date of review.
 *     tags:
 *       - Reviews
 *     parameters:
 *       - in: path
 *         name: vendorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the vendor
 *     responses:
 *       200:
 *         description: Vendor reviews fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vendor reviews fetched successfully
 *                 reviews:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 12
 *                       vendorId:
 *                         type: integer
 *                         example: 3
 *                       userId:
 *                         type: integer
 *                         example: 8
 *                       rating:
 *                         type: integer
 *                         example: 5
 *                       message:
 *                         type: string
 *                         example: Excellent service and fast delivery.
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-11-06T10:32:00.000Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-11-06T10:32:00.000Z
 *                       User:
 *                         type: object
 *                         properties:
 *                           firstName:
 *                             type: string
 *                             example: John
 *                           lastName:
 *                             type: string
 *                             example: Doe
 *       404:
 *         description: Vendor not found or has no reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No reviews found for this vendor.
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while fetching vendor reviews.
 */

router.get('/vendors/:vendorId/reviews', authentication, getVendorReviews)


/**
 * @swagger
 * /vendors/{vendorId}/reviews/summary:
 *   get:
 *     summary: Get vendor review summary
 *     description: Returns a summary of reviews for a vendor, including average rating, total reviews, and rating distribution.
 *     tags:
 *       - Reviews
 *     parameters:
 *       - in: path
 *         name: vendorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the vendor
 *     responses:
 *       200:
 *         description: Vendor review summary fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 vendorId:
 *                   type: integer
 *                   example: 3
 *                 averageRating:
 *                   type: string
 *                   example: "4.5"
 *                   description: Average rating across all reviews
 *                 totalReviews:
 *                   type: integer
 *                   example: 120
 *                   description: Total number of reviews for the vendor
 *                 ratingDistribution:
 *                   type: object
 *                   properties:
 *                     1:
 *                       type: integer
 *                       example: 3
 *                     2:
 *                       type: integer
 *                       example: 5
 *                     3:
 *                       type: integer
 *                       example: 15
 *                     4:
 *                       type: integer
 *                       example: 30
 *                     5:
 *                       type: integer
 *                       example: 67
 *       404:
 *         description: Vendor not found or has no reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No reviews found for this vendor.
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while fetching the review summary.
 */

router.get('/vendors/:vendorId/reviews/summary', getVendorReviewSummary)
// router.get('/vendors/:vendorId/reviews', authentication,getVendorReviews)



module.exports = router