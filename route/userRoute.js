const express = require('express')
const {
  signUp,
  verify,
  resendOtp,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyForgotPasswordOtp,
  ForgotPasswordOtpResend,
  getAllUsers,
  getOneUser,
  getUserProfile,
  getNearbyVendors,
  updateUserAccount,
} = require('../controller/userController')
const { authentication } = require('../middleware/authentication')
const { signUpValidation, loginValidator } = require('../middleware/validator')

const upload = require('../middleware/multer')

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
route.post('/user', signUpValidation, signUp)

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
route.post('/user/verify', verify)

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
route.post('/user/resend-otp', resendOtp)

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

route.post('/user/login', loginValidator, login)

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
route.post('/user/forgot-password', forgotPassword)

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
route.post('/user/forgot-password/resend', ForgotPasswordOtpResend)

/**
 * @swagger
 * /user/resetPassword:
 *   post:
 *     summary: Reset User Password
 *     description: Allows a user to reset their password using their registered email after OTP verification.
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
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The registered email of the user.
 *                 example: johndoe@example.com
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: The new password to be set.
 *                 example: StrongPass@123
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
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All fields are required
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
 *                   example: Internal server error
 */

route.post('/user/resetPassword', resetPassword)

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

route.put('/user/change-password', authentication, changePassword)

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
route.post('/user/verify-forgot-password-otp', verifyForgotPasswordOtp)

/**
 * @swagger
 * /user/getOneUser/{userId}:
 *   get:
 *     summary: Get a single user by ID
 *     description: Retrieves detailed information about a specific user using their unique user ID.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The unique identifier of the user
 *         schema:
 *           type: string
 *           example: 83e3a1fe8d9ab7ff15abac23
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User retrieved successfully
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
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-10-27T12:00:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-10-27T12:00:00.000Z
 *       400:
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
 *                   example: Internal server error
 */

route.get('/user/getOneUser/:userId', getOneUser)

/**
 * @swagger
 * /user/getAllusers:
 *   get:
 *     summary: Get all users
 *     description: Retrieves a list of all registered users in the system.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Users retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 83e3a1fe8d9ab7ff15abac23
 *                       firstName:
 *                         type: string
 *                         example: Mije
 *                       lastName:
 *                         type: string
 *                         example: Digban
 *                       email:
 *                         type: string
 *                         example: mdigban@gmail.com
 *                       phoneNumber:
 *                         type: string
 *                         example: 09056345749
 *                       isVerified:
 *                         type: boolean
 *                         example: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-10-27T12:00:00.000Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-10-27T12:00:00.000Z
 *       400:
 *         description: No users found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No users found
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

route.get('/user/getAllusers', getAllUsers)

/**
 * @swagger
 * /user/getUserProfile:
 *   get:
 *     summary: Get user profile
 *     description: Fetch the authenticated user's profile details such as name and email.
 *     tags:
 *       - User Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User profile fetched successfully
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
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Authentication failed
 *       500:
 *         description: Internal server error
 */

route.get('/user/getUserProfile', authentication, getUserProfile)

/**
 * @swagger
 * /user/getNearbyVendors:
 *   get:
 *     summary: Get nearby vendors
 *     description: Retrieve a list of available vendors sorted by rating in descending order.
 *     tags:
 *       - User Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Nearby vendors retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Nearby vendors retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       businessName:
 *                         type: string
 *                         example: RefillXpress Station
 *                       pricePerKg:
 *                         type: number
 *                         example: 650
 *                       openingTime:
 *                         type: string
 *                         example: 08:00 AM - 08:00 PM
 *                       rating:
 *                         type: number
 *                         example: 4.8
 *                       businessAddress:
 *                         type: string
 *                         example: 24 Isaac Boro Street, Port Harcourt
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Authentication failed
 *       500:
 *         description: Internal server error
 */

route.get('/user/getNearbyVendors', getNearbyVendors)

/**
 * @swagger
 * /user/update/Account:
 *   put:
 *     summary: Update a user's account details (profile picture and residential address)
 *     description: Allows an authenticated user to update their profile picture and residential address.
 *     tags:
 *       - User Dashboard
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: The user's new profile image file
 *               residentialAddress:
 *                 type: string
 *                 example: "123 Main Street, Lagos, Nigeria"
 *     responses:
 *       200:
 *         description: User account updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: user account updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     profilePicture:
 *                       type: string
 *                       example: "https://res.cloudinary.com/your-cloud/image/upload/v1728391023/user123.jpg"
 *                     residentialAddress:
 *                       type: string
 *                       example: "123 Main Street, Lagos, Nigeria"
 *       400:
 *         description: Bad request (invalid input or missing fields)
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

route.put('/user/update/Account', authentication, upload.single('profilePicture'), updateUserAccount)
module.exports = route
