const express = require ('express');
// const { vendorAuthentication } = require ('../middleware/authentication');
const {RiderSignUp, verifyRider, resendRiderOtp, riderForgotPassword, riderlogin, verifyRiderForgotPasswordOtp, resetRiderPassword} = require('../controller/riderController');

const router = express.Router();

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


router.post("/rider/verify", verifyRider)

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


router.post("/rider/resendOtp", resendRiderOtp)

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

router.post("/rider/forgotPassword", riderForgotPassword)

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

router.post("/rider/login", riderlogin)



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

router.post("/rider/verifyForgotPasswordOtp", verifyRiderForgotPasswordOtp)


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

router.post("/rider/resetPassword", resetRiderPassword )



module.exports = router