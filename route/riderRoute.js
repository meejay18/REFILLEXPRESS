const express = require('express')
// const { vendorAuthentication } = require ('../middleware/authentication');
const {
  RiderSignUp,
  verifyRider,
  resendRiderOtp,
  riderForgotPassword,
  riderlogin,
  verifyRiderForgotPasswordOtp,
  resetRiderPassword,
  changeRiderPassword,
  getRiderDashboard,
  getRecentRefills,
  acceptOrder,
  getAvailableRefills,
  getTotalEarnings,
  getTodaysEarnings,
  getActiveAndCompletedOrders,
  updateRiderAccount,
  getRiderById,
  getEarningsOverview,
  riderDashboardSummary,
} = require('../controller/riderController')
const { riderAuthentication } = require('../middleware/authentication')
const upload = require('../middleware/multer')
const riderUpdateUpload = upload.fields([
  { name: 'riderImage', maxCount: 1 },
  { name: 'driversLicense', maxCount: 1 },
  { name: 'vehicleRegistration', maxCount: 1 },
  { name: 'ownerIdCard', maxCount: 1 },
  { name: 'utilityBill', maxCount: 1 },
])

const router = express.Router()

/**
 * @swagger
 * /rider:
 *   post:
 *     summary: Register a new rider
 *     description: |
 *       This endpoint allows a new rider to sign up by providing their details.
 *       After successful registration, an OTP is sent to the rider's email for verification.
 *     tags:
 *       - Rider
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - phoneNumber
 *               - password
 *               - operatingArea
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@example.com"
 *               phoneNumber:
 *                 type: string
 *                 example: "+2348012345678"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "RiderPass123"
 *               operatingArea:
 *                 type: string
 *                 example: "Lagos Mainland"
 *     responses:
 *       201:
 *         description: Rider registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rider created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *       400:
 *         description: Rider with the given email already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rider already exists
 *       500:
 *         description: Internal server error.
 */

router.post('/rider', RiderSignUp)

/**
 * @swagger
 * /rider/verify:
 *   post:
 *     summary: Verify a rider's account using OTP
 *     description: |
 *       This endpoint verifies a **rider's email** using a One-Time Password (OTP) sent to their email during signup.
 *       Once verified, the rider can proceed to log in.
 *     tags:
 *       - Rider
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@example.com"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Rider verified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rider verified successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "a12b34c56d78"
 *                     email:
 *                       type: string
 *                       example: "johndoe@example.com"
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Invalid OTP or already verified.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid OTP
 *       404:
 *         description: Rider not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rider not found
 *       500:
 *         description: Internal server error.
 */

router.post('/rider/verify', verifyRider)

/**
 * @swagger
 * /rider/resendOtp:
 *   post:
 *     summary: Resend OTP to a rider's email
 *     description: This endpoint resends a new one-time password (OTP) to a rider’s registered email for verification. OTP expires after 5 minutes.
 *     tags:
 *       - Rider
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: rider@example.com
 *                 description: The email address of the rider requesting a new OTP.
 *     responses:
 *       200:
 *         description: OTP resent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP resent successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: rider@example.com
 *                     otpSent:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Rider is already verified or invalid request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rider already verified
 *       404:
 *         description: Rider not found in the database.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rider not found
 *       500:
 *         description: Internal server error while resending OTP.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

router.post('/rider/resendOtp', resendRiderOtp)

/**
 * @swagger
 * /rider/forgotPassword:
 *   post:
 *     summary: Send OTP for Rider password reset
 *     description: This endpoint sends a one-time password (OTP) to the rider's registered email for password reset purposes. The OTP expires after 5 minutes.
 *     tags:
 *       - Rider
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: rider@example.com
 *                 description: The registered email address of the rider.
 *     responses:
 *       200:
 *         description: OTP successfully sent to the rider's email for password reset.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: forgot password request sent
 *       404:
 *         description: Rider not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rider not found
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred
 */

router.post('/rider/forgotPassword', riderForgotPassword)

/**
 * @swagger
 * /rider/login:
 *   post:
 *     summary: Rider login
 *     description: Authenticates a verified rider using their email and password, returning a JWT token upon successful login.
 *     tags:
 *       - Rider
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: rider@example.com
 *                 description: The registered email address of the rider.
 *               password:
 *                 type: string
 *                 format: password
 *                 example: MySecurePassword123
 *                 description: The rider's account password.
 *     responses:
 *       200:
 *         description: Rider logged in successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successfull
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 1e8a8c40-0a8d-4a44-bcc1-df0efc903a6d
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     email:
 *                       type: string
 *                       example: rider@example.com
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Invalid login details or unverified account.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Incorrect password
 *       404:
 *         description: Rider not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rider not found
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred
 */

router.post('/rider/login', riderlogin)

/**
 * @swagger
 * /rider/verifyForgotPasswordOtp:
 *   post:
 *     summary: Verify Rider Forgot Password OTP
 *     description: Verifies the OTP sent to a rider’s email during the forgot password process and returns a temporary JWT token for password reset.
 *     tags:
 *       - Rider
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: rider@example.com
 *                 description: The rider’s registered email address.
 *               otp:
 *                 type: string
 *                 example: "482913"
 *                 description: The one-time password sent to the rider’s email.
 *     responses:
 *       200:
 *         description: OTP verified successfully and token returned for password reset.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   example: rider@example.com
 *                 message:
 *                   type: string
 *                   example: Otp verified successfully
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Invalid or expired OTP provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: otp expired, please request a new one
 *       404:
 *         description: Rider not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: rider not found
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred
 */

router.post('/rider/verifyForgotPasswordOtp', verifyRiderForgotPasswordOtp)

/**
 * @swagger
 * /rider/resetPassword:
 *   post:
 *     summary: Reset Rider Password
 *     description: Allows a verified rider to reset their password after successfully verifying their OTP.
 *     tags:
 *       - Rider
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: rider@example.com
 *                 description: The rider’s registered email address.
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: MySecurePassword123!
 *                 description: The new password for the rider account.
 *     responses:
 *       200:
 *         description: Password reset successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset successfully
 *       400:
 *         description: Missing fields or validation errors.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All fields are required
 *       404:
 *         description: Rider not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: rider not found
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred
 */

router.post('/rider/resetPassword', resetRiderPassword)

/**
 * @swagger
 * /rider/changePassword:
 *   post:
 *     summary: Change rider account password
 *     description: Allows a rider to securely change their password by providing their old password and confirming a new one.
 *     tags:
 *       - Rider
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: "OldPass123!"
 *               newPassword:
 *                 type: string
 *                 example: "NewPass456!"
 *               confirmPassword:
 *                 type: string
 *                 example: "NewPass456!"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password changed successfully
 *       400:
 *         description: Old password incorrect or new passwords do not match
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: new password incorrect
 *       404:
 *         description: Rider not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: rider not found
 */

router.post('/rider/changePassword', changeRiderPassword)

/**
 * @swagger
 * /rider/{riderId}:
 *   get:
 *     summary: Get Rider Dashboard
 *     description: Fetch detailed dashboard information for a specific rider by their ID.
 *     tags:
 *       - Rider Dashboard
 *     parameters:
 *       - in: path
 *         name: riderId
 *         required: true
 *         description: Unique identifier of the rider
 *         schema:
 *           type: string
 *           example: a7b8c9d0
 *     responses:
 *       200:
 *         description: Rider dashboard fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rider dashboard fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: johndoe@example.com
 *                     phoneNumber:
 *                       type: string
 *                       example: "+1234567890"
 *                     operatingArea:
 *                       type: string
 *                       example: Downtown
 *                     earnings:
 *                       type: number
 *                       format: float
 *                       example: 2540.75
 *                     status:
 *                       type: string
 *                       example: active
 *                     rating:
 *                       type: number
 *                       format: float
 *                       example: 4.8
 *                     refills:
 *                       type: integer
 *                       example: 120
 *       404:
 *         description: Rider not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rider not found
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
router.get('/rider/:riderId', riderAuthentication, getRiderDashboard)

/**
 * @swagger
 * /rider/get/available-refills:
 *   get:
 *     summary: Retrieve all available pending refill orders (unassigned orders)
 *     description: This endpoint allows authenticated riders to view all refill orders that are currently pending and have not been assigned to any rider.
 *     tags: [Rider Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of available pending refill orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: pending refills
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized - Rider not authenticated
 *       500:
 *         description: Internal server error
 */

router.get('/rider/get/available-refills', riderAuthentication, getAvailableRefills)

/**
 * @swagger
 * /recent-refills:
 *   get:
 *     summary: Get the 10 most recent completed refills for the authenticated rider
 *     tags:
 *       - Rider Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response with recent refills
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Recent refills"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       status:
 *                         type: string
 *                         example: "completed"
 *                       riderId:
 *                         type: integer
 *                         example: 5
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-11-09T10:00:00.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-11-09T10:00:00.000Z"
 *       401:
 *         description: Unauthorized, rider not authenticated
 *       500:
 *         description: Internal server error
 */

router.get('/recent-refills', riderAuthentication, getRecentRefills)

/**
 * @swagger
 * /total-earnings:
 *   get:
 *     summary: Get total earnings for the authenticated rider
 *     description: Calculates the total earnings of a rider based on all completed orders. Each completed order contributes 5% of its total price to the rider's earnings.
 *     tags:
 *       - Rider Dashboard
 *     security:
 *       - bearerAuth: []    # Requires rider authentication
 *     responses:
 *       200:
 *         description: Total earnings calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Total earnings calculated successfully
 *                 totalEarnings:
 *                   type: number
 *                   example: 7500.50
 *       400:
 *         description: Rider ID missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rider ID missing
 *       500:
 *         description: Server error while fetching earnings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

router.get('/total-earnings', riderAuthentication, getTotalEarnings)

/**
 * @swagger
 * /todays-earnings:
 *   get:
 *     summary: Get today's earnings for the authenticated rider
 *     tags: [Rider Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total earnings calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Today's earnings"
 *                 earnings:
 *                   type: number
 *                   example: 150.75
 *       401:
 *         description: Unauthorized - rider not authenticated
 *       500:
 *         description: Server error
 */

router.get('/todays-earnings', riderAuthentication, getTodaysEarnings)

/**
 * @swagger
 * /rider/get/getActiveAndCompletedOrders:
 *   get:
 *     summary: Get rider's active and completed orders
 *     description: This endpoint retrieves all active and completed orders assigned to the authenticated rider.
 *     tags: [Rider Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved rider's active and completed orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     active:
 *                       type: array
 *                       description: List of active orders assigned to the rider
 *                       items:
 *                         $ref: '#/components/schemas/Order'
 *                     completed:
 *                       type: array
 *                       description: List of completed orders assigned to the rider
 *                       items:
 *                         $ref: '#/components/schemas/Order'
 *       400:
 *         description: Rider ID missing or invalid request
 *       401:
 *         description: Unauthorized - Rider not authenticated
 *       500:
 *         description: Internal server error
 */

router.get('/rider/get/getActiveAndCompletedOrders', riderAuthentication, getActiveAndCompletedOrders)

/**
 * @swagger
 * /rider/{riderId}/accountUpdate:
 *   patch:
 *     summary: Update rider account details and upload KYC documents
 *     tags: [Rider Dashboard]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: riderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the rider to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               residentialAddress:
 *                 type: string
 *                 example: "12 Example Street, Lagos"
 *               fullName:
 *                 type: string
 *                 example: "John Doe"
 *               phoneNumber:
 *                 type: string
 *                 example: "08012345678"
 *               accountName:
 *                 type: string
 *                 example: "John Doe"
 *               accountNumber:
 *                 type: string
 *                 example: "0123456789"
 *               bankName:
 *                 type: string
 *                 example: "Access Bank"
 *               driversLicense:
 *                 type: string
 *                 format: binary
 *               vehicleRegistration:
 *                 type: string
 *                 format: binary
 *               ownerIdCard:
 *                 type: string
 *                 format: binary
 *               utilityBill:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Rider account updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rider account updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Rider'
 *       404:
 *         description: Rider not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /rider/{riderId}/accountUpdate:
 *   patch:
 *     summary: Update rider account details and KYC documents
 *     description: Allows an authenticated rider to update their profile details and upload KYC documents such as driver's license, vehicle registration, utility bill, and ID card.
 *     tags:
 *       - Rider Dashboard
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: riderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the rider to update
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               phoneNumber:
 *                 type: string
 *                 example: "+2348123456789"
 *               residentialAddress:
 *                 type: string
 *                 example: 15 New Layout, Lekki Phase 2
 *               riderImage:
 *                 type: string
 *                 format: binary
 *                 description: Rider profile image
 *               accountName:
 *                 type: string
 *                 example: John Doe
 *               accountNumber:
 *                 type: string
 *                 example: "0123456789"
 *               bankName:
 *                 type: string
 *                 example: Access Bank
 *               driversLicense:
 *                 type: string
 *                 format: binary
 *               vehicleRegistration:
 *                 type: string
 *                 format: binary
 *               ownerIdCard:
 *                 type: string
 *                 format: binary
 *               utilityBill:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Rider account updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Rider account updated successfully
 *               data:
 *                 id: 1
 *                 fullName: John Doe
 *                 phoneNumber: "+2348123456789"
 *                 residentialAddress: 15 New Layout, Lekki Phase 2
 *                 riderImage: https://cloudinary.com/.../image.jpg
 *                 accountName: John Doe
 *                 accountNumber: "0123456789"
 *                 bankName: Access Bank
 *                 kyc:
 *                   driversLicense: https://cloudinary.com/.../license.jpg
 *                   vehicleRegistration: https://cloudinary.com/.../vehicle.jpg
 *                   ownerIdCard: https://cloudinary.com/.../id.jpg
 *                   utilityBill: https://cloudinary.com/.../utility.jpg
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               message: Validation error
 *       404:
 *         description: Rider not found
 *         content:
 *           application/json:
 *             example:
 *               message: Rider does not exist
 *       500:
 *         description: Server error
 */

router.patch('/rider/:riderId/accountUpdate', riderAuthentication, riderUpdateUpload, updateRiderAccount)


/**
 * @swagger
 * /getOneRider/{riderId}:
 *   get:
 *     summary: Get a single rider by ID
 *     description: Fetch detailed information about a rider including KYC documents.
 *     tags:
 *       - Rider
 *     parameters:
 *       - in: path
 *         name: riderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Rider's unique ID
 *     responses:
 *       200:
 *         description: Rider fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Rider fetched successfully"
 *               data:
 *                 id: 1
 *                 fullName: "John Doe"
 *                 phoneNumber: "+2348012345678"
 *                 residentialAddress: "12 Lekki Phase 1, Lagos"
 *                 accountName: "John Doe"
 *                 accountNumber: "0123456789"
 *                 bankName: "GTBank"
 *                 riderImage: "https://cloudinary.com/rider-image.jpg"
 *                 createdAt: "2025-01-10T12:00:00.000Z"
 *                 updatedAt: "2025-01-10T12:00:00.000Z"
 *                 kyc:
 *                   driversLicense: "https://cloudinary.com/drivers-license.jpg"
 *                   vehicleRegistration: "https://cloudinary.com/vehicle-reg.jpg"
 *                   ownerIdCard: "https://cloudinary.com/owner-id.jpg"
 *                   utilityBill: "https://cloudinary.com/utility-bill.jpg"
 *       404:
 *         description: Rider not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Rider not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal server error"
 */


router.get('/getOneRider/:riderId', getRiderById)


/**
 * @swagger
 * /rider/dashboard/overview:
 *   get:
 *     summary: Get rider dashboard summary
 *     tags:
 *       - Rider Dashboard
 *     security:
 *       - bearerAuth: []
 *     description: Returns earnings, refills count, active time, and rating for a rider for the current day.
 *     responses:
 *       200:
 *         description: Successfully retrieved dashboard summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rider dashboard summary retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     earnings:
 *                       type: string
 *                       example: "₦1500.00"
 *                     refills:
 *                       type: integer
 *                       example: 3
 *                     activeTime:
 *                       type: string
 *                       example: "02:15"
 *                     rating:
 *                       type: string
 *                       example: "4.5"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */

router.get('/rider/dashboard/overview', riderAuthentication, riderDashboardSummary)
module.exports = router

// riderId
// 1666b874-0e7f-4483-90b7-c84918a1b19f
