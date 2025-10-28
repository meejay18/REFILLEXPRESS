const express = require('express')
const { signUp, verify, resendOtp, login, forgotPassword, resetPassword, changePassword, verifyForgotPasswordOtp, ForgotPasswordOtpResend } = require('../controller/userController')
const { authentication } = require('../middleware/authentication')

const route = express.Router()

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user account
 *     tags: [User]
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
 * /user/verify:
 *   post:
 *     summary: Verify user OTP
 *     tags: [User]
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
 * /user/resend-otp:
 *   post:
 *     summary: Resend OTP for user verification
 *     tags: [User]
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
 * /user/login:
 *   post:
 *     summary: Log in a user
 *     description: Authenticates a registered and verified user, returning a JWT token if successful.
 *     tags:
 *       - User
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
 * /user/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [User]
 *     description: Sends a 6-digit OTP to the user's email to begin the password reset process.
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
 *                 example: johndoe@gmail.com
 *     responses:
 *       200:
 *         description: Reset password OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: forgot password request sent
 *
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
 *
 *       500:
 *         description: Internal server error
 */
route.post('/user/forgot-password', forgotPassword);

/**
 * @swagger
 * /user/forgot-password/resend:
 *   post:
 *     summary: Resend OTP for resetting password
 *     tags: [User]
 *     description: Resends a 6-digit OTP to the user's registered email for password reset verification.
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
 *                 example: johndoe@gmail.com
 *     responses:
 *       200:
 *         description: OTP resent successfully for password reset
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: forgot password request sent
 *
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
 *
 *       500:
 *         description: Internal server error
 */
route.post('/user/forgot-password/resend', ForgotPasswordOtpResend);




/**
 * @swagger
 * /user/reset/password/{token}:
 *   post:
 *     summary: Reset user password
 *     description: This endpoint allows a user to reset their password using a valid token sent via email. The token is verified and, if valid, the password is updated.
 *     tags:
 *       - User
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





/**
 * @swagger
 * /user/change-password:
 *   put:
 *     summary: Change user password
 *     description: Allows an authenticated user to change their password by providing the old password, new password, and confirmation password.
 *     tags:
 *       - User
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
 *                 example: oldPassword123
 *               newPassword:
 *                 type: string
 *                 example: newPassword456
 *               confirmPassword:
 *                 type: string
 *                 example: newPassword456
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Password changed successfully
 *       400:
 *         description: Old password incorrect or passwords do not match
 *         content:
 *           application/json:
 *             examples:
 *               oldPasswordIncorrect:
 *                 summary: Old password incorrect
 *                 value:
 *                   message: old Password incorrect
 *               passwordMismatch:
 *                 summary: New passwords do not match
 *                 value:
 *                   message: new password incorrect
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               message: User not found
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *         content:
 *           application/json:
 *             example:
 *               message: Unauthorized access
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: An unexpected error occurred
 */



route.put("/user/change-password", authentication, changePassword)


/**
 * @swagger
 * /user/verify-forgot-password-otp:
 *   post:
 *     summary: Verify OTP for Forgot Password
 *     description: Verifies a one-time password (OTP) sent to the user's email for password reset. If valid, it returns a temporary JWT token that can be used to reset the password.
 *     tags:
 *       - User
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
 *                 example: johndoe@example.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   example: johndoe@example.com
 *                 message:
 *                   type: string
 *                   example: Otp verified successfully
 *                 token:
 *                   type: string
 *                   description: Temporary JWT token for password reset
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Invalid or expired OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid otp
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
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
route.post("/user/verify-forgot-password-otp", verifyForgotPasswordOtp)
module.exports = route
