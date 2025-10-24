const express = require('express')
const { signUp, verify, resendOtp, login, forgotPassword, resetPassword } = require('../controller/userController')

const route = express.Router()

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /api/v1/user:
 *   post:
 *     summary: Create a new user account
 *     tags: [Users]
 *     description: Endpoint for signing up a new user.
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
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Mije
 *               lastName:
 *                 type: string
 *                 example: Digban
 *               email:
 *                 type: string
 *                 example: mdigban@gmail.com
 *               phoneNumber:
 *                 type: string
 *                 example: 09056345749
 *               password:
 *                 type: string
 *                 example: 12345
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 83e3a1fe8d9ab7ff15abac23
 *                     firstName:
 *                       type: string
 *                       example: Mije
 *                     lastName:
 *                       type: string
 *                       example: Digban
 *                     email:
 *                       type: string
 *                       example: mdigban@gmail.com
 *                     phoneNumber:
 *                       type: string
 *                       example: 09056345749
 */
route.post('/user', signUp)




/**
 * @swagger
 * /api/v1/user/verify:
 *   post:
 *     summary: Verify user OTP
 *     tags: [Users]
 *     description: Verify the user's account using the OTP sent to their email.
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
 *                 example: mdigban@gmail.com
 *               otp:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: User verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User verified successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     isVerified:
 *                       type: boolean
 */
route.post("/user/verify", verify)




/**
 * @swagger
 * /api/v1/user/resend-otp:
 *   post:
 *     summary: Resend OTP for user verification
 *     tags: [Users]
 *     description: Allows users to request a new OTP if the previous one expired or wasn't received.
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
 *                 example: mdigban@gmail.com
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
 *                   example: New OTP sent successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: mdigban@gmail.com
 *                     otpSent:
 *                       type: boolean
 *                       example: true
 *       404:
 *         description: User not found
 *       400:
 *         description: User already verified
 */
route.post("/user/resend-otp", resendOtp)








/**
 * @swagger
 * /api/v1/user/login:
 *   post:
 *     summary: Log in a user
 *     description: Authenticates a registered and verified user, returning a JWT token if successful.
 *     tags:
 *       - Users
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
 *                 example: mdigban@gmail.com
 *               password:
 *                 type: string
 *                 example: 12345
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
 *                       example: 83e3a1fe8d9ab7ff15abac23
 *                     firstName:
 *                       type: string
 *                       example: Mije
 *                     lastName:
 *                       type: string
 *                       example: Digban
 *                     email:
 *                       type: string
 *                       example: mdigban@gmail.com
 *                     role:
 *                       type: string
 *                       example: user
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: User not verified or incorrect password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not verified, please verify your account
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 */

route.post("/user/login", login)





/**
 * @swagger
 * /api/v1/user/forgot-password:
 *   post:
 *     summary: Request password reset
 *     description: Sends a password reset link to the user's registered email address if the account exists.
 *     tags:
 *       - Users
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
 *                 example: mdigban@gmail.com
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
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 */

route.post("/user/forgot-password", forgotPassword)




/**
 * @swagger
 * /api/v1/user/reset/password/{token}:
 *   post:
 *     summary: Reset user password
 *     description: This endpoint allows a user to reset their password using a valid token sent via email. The token is verified and, if valid, the password is updated.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: JWT token received via email for password reset
 *         schema:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
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
 *                 example: StrongPassword123!
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: StrongPassword123!
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
 *         description: Invalid input, expired token, or mismatched passwords
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Passwords do not match
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

route.post("/user/reset/password/:token", resetPassword)
module.exports = route
