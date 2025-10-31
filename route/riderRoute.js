const express = require ('express');
// const { vendorAuthentication } = require ('../middleware/authentication');
const {RiderSignUp, verifyRider,resendRiderOtp, Riderlogin, riderResetPassword,changeRiderPassword,getAllRiders,getOneRider} = require('../controller/riderController');

const router = express.Router();



/**
 * @swagger
 * /api/v1/rider:
 *   post:
 *     summary: Create a new rider account
 *     tags: [Riders]
 *     description: Endpoint for signing up a new rider.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - password
 *               - emailAddress
 *               - phoneNumber
 *               - operatingArea
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Digban 
 *               lastName:
 *                 type: string
 *                 example: Deke
 *               emailAddress:
 *                 type: string
 *                 example: Martinsdeke@gmail.com
 *               phoneNumber:
 *                 type: string
 *                 example: 09069412639
 *               password:
 *                 type: string
 *                 example: StrongPassword123!
 *               operatingArea:
 *                 type: string
 *                 example: Magodo
 *     responses:
 *       201:
 *         description: Rider successfully created
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
 *                       example: Martins
 *                     lastName:
 *                       type: string
 *                       example: Deke
 *                     emailAddress:
 *                       type: string
 *                       example: Martinsdeke@gmail.com
 *                     operatingArea:
 *                       type: string
 *                       example: Magodo
 *                     phoneNumber:
 *                       type: string
 *                       example: 09069412639
 *                     password:
 *                       type: string
 *                       example: StrongPassword123!
 *       400:
 *         description: Rider already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rider already exists
 */
router.post('/rider', RiderSignUp)


/**
 * @swagger
 * /api/riders/verify:
 *   post:
 *     summary: Verify a rider's account using OTP
 *     description: This endpoint verifies a rider's account by checking the OTP sent to their email. The OTP must be valid and not expired.
 *     tags:
 *       - Riders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emailAddress
 *               - otp
 *             properties:
 *               emailAddress:
 *                 type: string
 *                 format: email
 *                 example: rider@example.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Rider verified successfully
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
 *                       example: "b4d9f1e0-29a5-4b8e-8f9b-123456789abc"
 *                     email:
 *                       type: string
 *                       example: rider@example.com
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Bad request — invalid OTP, expired OTP, or already verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid OTP
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
router.post('/riders', verifyRider)


/**
 * @swagger
 * /riders/resend-otp:
 *   post:
 *     summary: Resend OTP to a rider's email
 *     description: |
 *       This endpoint resends a new OTP to the rider's registered email address for verification.  
 *       The OTP will expire after 5 minutes.  
 *       If the rider is already verified, no OTP will be sent.
 *     tags:
 *       - Riders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emailAddress
 *             properties:
 *               emailAddress:
 *                 type: string
 *                 format: email
 *                 example: rider@example.com
 *     responses:
 *       200:
 *         description: OTP resent successfully
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
 *                     emailAddress:
 *                       type: string
 *                       example: rider@example.com
 *                     otpSent:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Rider already verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rider already verified
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
router.post('/riders/resend-otp',resendRiderOtp )


/**
 * @swagger
 * /api/riders/login:
 *   post:
 *     summary: Rider login
 *     description: |
 *       Authenticates a rider using their email and password.  
 *       Returns a JWT token upon successful login.  
 *       The rider must have a verified account before logging in.
 *     tags:
 *       - Riders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emailAddress
 *               - password
 *             properties:
 *               emailAddress:
 *                 type: string
 *                 format: email
 *                 example: rider@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Passw0rd!
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "b4d9f1e0-29a5-4b8e-8f9b-123456789abc"
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     emailAddress:
 *                       type: string
 *                       example: rider@example.com
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Invalid credentials or unverified rider
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Incorrect password
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
router.post('/rider/login', Riderlogin);



/**
 * @swagger
 * /api/riders/reset-password/{token}:
 *   post:
 *     summary: Reset rider's password
 *     description: |
 *       This endpoint allows a rider to reset their password using a valid JWT reset token.  
 *       The new password must match the confirmation password.  
 *       The token expires after a set time period.
 *     tags:
 *       - Riders
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT reset token sent to the rider's email.
 *         example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: NewPassw0rd!
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: NewPassw0rd!
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset successfully
 *       400:
 *         description: Bad request — password mismatch, invalid token, or expired link
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Passwords do not match
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
router.post('/rider/reset-password/:token', riderResetPassword)

/**
 * @swagger
 * /api/riders/forgot-password:
 *   post:
 *     summary: Rider forgot password
 *     description: |
 *       This endpoint initiates the password reset process for a rider.  
 *       It sends a password reset link with a JWT token to the rider's registered email address.  
 *       The reset link expires after 20 minutes.
 *     tags:
 *       - Riders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emailAddress
 *             properties:
 *               emailAddress:
 *                 type: string
 *                 format: email
 *                 example: rider@example.com
 *     responses:
 *       200:
 *         description: Forgot password request sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: forgot password request sent
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

router.post('/rider/forgot-password', riderResetPassword)


/**
 * @swagger
 * /api/riders/change-password:
 *   put:
 *     summary: Change rider's password
 *     description: |
 *       This endpoint allows a verified and authenticated rider to change their password.  
 *       The rider must provide the correct current (old) password.  
 *       The new password and confirmation must match.
 *     tags:
 *       - Riders
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
 *                 format: password
 *                 example: OldPassw0rd!
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: NewPassw0rd!
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: NewPassw0rd!
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
 *         description: Bad request — incorrect old password or mismatched new passwords
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: old Password incorrect
 *       404:
 *         description: Rider not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rider Password not found
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

router.patch('/rider/change-password', changeRiderPassword)


/**
 * @swagger
 * /api/riders:
 *   get:
 *     summary: Retrieve all riders
 *     description: |
 *       This endpoint retrieves a list of all registered riders in the system.  
 *       Returns an array of rider objects.  
 *       If no riders exist, it returns a message indicating that no riders were found.
 *     tags:
 *       - Riders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Riders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Riders retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "b4d9f1e0-29a5-4b8e-8f9b-123456789abc"
 *                       firstName:
 *                         type: string
 *                         example: John
 *                       lastName:
 *                         type: string
 *                         example: Doe
 *                       emailAddress:
 *                         type: string
 *                         example: rider@example.com
 *                       isVerified:
 *                         type: boolean
 *                         example: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-10-29T12:34:56.789Z
 *       400:
 *         description: No riders found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No riders found
 *                 data:
 *                   type: array
 *                   example: []
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
router.get("/rider/getAllRiders", getAllRiders)



/**
 * @swagger
 * /api/riders/{riderId}:
 *   get:
 *     summary: Retrieve a single rider by ID
 *     description: |
 *       This endpoint retrieves the details of a single rider using their unique ID.
 *     tags:
 *       - Riders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: riderId
 *         in: path
 *         required: true
 *         description: The unique ID of the rider
 *         schema:
 *           type: string
 *           example: b4d9f1e0-29a5-4b8e-8f9b-123456789abc
 *     responses:
 *       200:
 *         description: Rider retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rider retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: b4d9f1e0-29a5-4b8e-8f9b-123456789abc
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     emailAddress:
 *                       type: string
 *                       example: rider@example.com
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-10-29T12:34:56.789Z
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
router.get("/rider/getOneRider /:riderId", getOneRider )



module.exports = router