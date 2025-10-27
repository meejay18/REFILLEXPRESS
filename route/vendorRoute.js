const express = require ('express');
const { vendorAuthentication } = require ('../middleware/authentication');
const { vendorSignUp, verifyVendor, resendVendorOtp, Vendorlogin, vendorForgotPassword, vendorResetPassword, changeVendorPassword, getAllvendors, getOneVendor, vendorForgotPasswordOtpResend } = require('../controller/vendorController');
const { verifyOtp, verifyForgotPasswordOtp } = require('../controller/userController');

const router = express.Router();



/**
 * @swagger
 * /api/v1/vendor:
 *   post:
 *     summary: Create a new vendor account
 *     tags: [Vendors]
 *     description: Endpoint for signing up a new vendor. An OTP will be sent to the business email for verification.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - businessName
 *               - businessEmail
 *               - businessPhoneNumber
 *               - businessAddress
 *               - firstName
 *               - lastName
 *               - password
 *             properties:
 *               businessName:
 *                 type: string
 *                 example: Digban Stores
 *               businessEmail:
 *                 type: string
 *                 example: Martinsdeke@gmail.com
 *               businessPhoneNumber:
 *                 type: string
 *                 example: 09069412639
 *               businessAddress:
 *                 type: string
 *                 example: 15 Adeniyi Jones, Ikeja Lagos
 *               firstName:
 *                 type: string
 *                 example: Martins
 *               lastName:
 *                 type: string
 *                 example: Deke
 *               password:
 *                 type: string
 *                 example: StrongPassword123!
 *     responses:
 *       201:
 *         description: Vendor successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vendor created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                       example: Martins
 *                     lastName:
 *                       type: string
 *                       example: Deke
 *                     businessEmail:
 *                       type: string
 *                       example: Martinsdeke@gmail.com
 *       400:
 *         description: Vendor already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vendor already exists
 */
router.post('/vendor',  vendorSignUp)
/**
 * @swagger
 * /api/v1/vendor/verify:
 *   post:
 *     summary: Verify vendor account using OTP
 *     tags: [Vendors]
 *     description: Confirms OTP sent to vendor's business email to activate account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - businessEmail
 *               - otp
 *             properties:
 *               businessEmail:
 *                 type: string
 *                 example: martinsdeke@gmail.com
 *               otp:
 *                 type: string
 *                 example: "148883"
 *     responses:
 *       200:
 *         description: Vendor verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vendor verified successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: digbanshop@gmail.com
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Invalid OTP or OTP expired or vendor already verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     invalidOTP:
 *                       summary: Invalid OTP
 *                       value: Invalid OTP
 *                     otpExpired:
 *                       summary: OTP expired
 *                       value: Otp expired, Please request another otp
 *                     alreadyVerified:
 *                       summary: Vendor already verified
 *                       value: Vendor already verified, Please proceed to login
 *       404:
 *         description: Vendor not found
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
 */
router.post('/vendor/verify', verifyVendor)

/**
 * @swagger
 * /api/v1/vendor/resend-otp:
 *   post:
 *     summary: Resend OTP to vendor's business email
 *     tags: [Vendors]
 *     description: Generates and sends a new OTP if the vendor is not yet verified.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - businessEmail
 *             properties:
 *               businessEmail:
 *                 type: string
 *                 example: martinsdeke@gmail.com
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
 *                     businessEmail:
 *                       type: string
 *                       example: martinsdeke@gmail.com
 *                     otpSent:
 *                       type: boolean
 *                       example: true
 *
 *       400:
 *         description: Vendor already verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vendor already verified
 *
 *       404:
 *         description: Vendor not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vendor not found
 *
 *       500:
 *         description: Internal server error
 */
router.post('/vendor/resend-otp', resendVendorOtp)

/**
 * @swagger
 * /api/v1/vendor/login:
 *   post:
 *     summary: Login vendor account
 *     tags: [Vendors]
 *     description: Authenticates vendor using business email and password. Returns JWT token upon successful login.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - businessEmail
 *               - password
 *             properties:
 *               businessEmail:
 *                 type: string
 *                 example: Martinsdeke@gmail.com
 *               password:
 *                 type: string
 *                 example: StrongPassword123!
 *     responses:
 *       200:
 *         description: Login successfully
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
 *                       type: integer
 *                       example: 1
 *                     firstName:
 *                       type: string
 *                       example: Mije
 *                     lastName:
 *                       type: string
 *                       example: Digban
 *                     businessEmail:
 *                       type: string
 *                       example: digbanshop@gmail.com
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR...
 *
 *       400:
 *         description: Incorrect password or vendor not verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     incorrectPassword:
 *                       summary: Incorrect password
 *                       value: Incorrect password
 *                     notVerified:
 *                       summary: Vendor not verified
 *                       value: Vendor not verified, please verify your account
 *
 *       404:
 *         description: Vendor not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vendor not found
 *
 *       500:
 *         description: Internal server error
 */
router.post('/vendor/login', Vendorlogin);







/**
 * @swagger
 * /api/vendor/forgot-password:
 *   post:
 *     summary: Vendor Forgot Password Request
 *     description: Initiates the password reset process for a vendor by sending a one-time password (OTP) to their registered business email. The OTP is valid for 5 minutes.
 *     tags:
 *       - Vendor Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - businessEmail
 *             properties:
 *               businessEmail:
 *                 type: string
 *                 format: email
 *                 example: vendor@example.com
 *     responses:
 *       200:
 *         description: Forgot password OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: forgot password request sent
 *       404:
 *         description: Vendor not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vendor not found
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

router.post('/vendor/forgot-password', vendorForgotPassword)

/**
 * @swagger
 * /api/v1/vendor/reset-password/{token}:
 *   post:
 *     summary: Reset password using token
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     description: Vendor can reset password using a valid reset token provided in the reset email.
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         description: JWT reset token sent via email
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
 *                 example: StrongNewPass123!
 *               confirmPassword:
 *                 type: string
 *                 example: StrongNewPass123!
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
 *
 *       400:
 *         description: Validation errors or expired/invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     missing:
 *                       summary: Missing passwords
 *                       value: please provide both passwords
 *                     mismatch:
 *                       summary: Password mismatch
 *                       value: Passwords do not match
 *                     expired:
 *                       summary: Token expired
 *                       value: Reset link has expired
 *                     invalid:
 *                       summary: Invalid token
 *                       value: Invalid or malformed token
 *
 *       404:
 *         description: Vendor not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vendor not found
 *
 *       500:
 *         description: Internal server error
 */
router.post('/vendor/reset-password/:token', vendorResetPassword)



/**
 * @swagger
 * /api/v1/vendor/change-password:
 *   patch:
 *     summary: Change vendor password
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     description: Vendor updates their password after login by providing the correct old password and confirming the new one.
 *
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
 *                 example: OldPassword123!
 *               newPassword:
 *                 type: string
 *                 example: NewStrongPassword456!
 *               confirmPassword:
 *                 type: string
 *                 example: NewStrongPassword456!
 *
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
 *
 *       400:
 *         description: Old password incorrect or new passwords do not match
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     incorrectOld:
 *                       summary: Incorrect old password
 *                       value: old Password incorrect
 *                     mismatch:
 *                       summary: New password mismatch
 *                       value: new password incorrect
 *
 *       404:
 *         description: Vendor not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vendor not found
 *
 *       500:
 *         description: Internal server error
 */
router.patch('/vendor/change-password', vendorAuthentication, changeVendorPassword)



/**
 * @swagger
 * /api/v1/vendor/getAllvendors:
 *   get:
 *     summary: Retrieve all vendors
 *     description: Fetches all registered vendors from the database.
 *     tags: [Vendors]
 *     responses:
 *       200:
 *         description: Vendors retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vendors retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 2f1b5eac-b9f9-4a9c-a234-913f26f6c567
 *                       businessName:
 *                         type: string
 *                         example: John's Electronics
 *                       businessEmail:
 *                         type: string
 *                         example: john@electronics.com
 *                       businessPhoneNumber:
 *                         type: string
 *                         example: +2348012345678
 *                       businessAddress:
 *                         type: string
 *                         example: 23,Molade road, Ikeja
 *                       status:
 *                         type: string
 *                         example: active
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-10-26T12:45:00Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-10-26T12:45:00Z
 *       400:
 *         description: No vendors found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No vendors found
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
 *                   example: Internal Server Error
 */

router.get("/vendor/getAllvendors", getAllvendors)


/** 
 * @swagger
 * /api/v1/vendor/getOneVendor/{vendorId}:
 *   get:
 *     summary: Retrieve a single vendor
 *     description: Fetches a vendor from the database using the vendor's unique ID.
 *     tags:
 *       - Vendor
 *     parameters:
 *       - name: vendorId
 *         in: path
 *         required: true
 *         description: The unique ID of the vendor to retrieve.
 *         schema:
 *           type: string
 *           example: "13b515f6-bd91-4b0a-9d3e-e94b32ca5ab0"
 *     responses:
 *       200:
 *         description: Vendor retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vendor retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "13b515f6-bd91-4b0a-9d3e-e94b32ca5ab0"
 *                     businessName:
 *                       type: string
 *                       example: "Bright Stores Ltd"
 *                     businessEmail:
 *                       type: string
 *                       example: "contact@brightstores.com"
 *                     businessPhoneNumber:
 *                       type: string
 *                       example: "09055674321"
 *                     businessAddress:
 *                       type: string
 *                       example: "23 Obafemi Awolowo Road, Ikeja, Lagos"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-26T12:30:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-26T12:40:00.000Z"
 *       404:
 *         description: Vendor not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vendor not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while retrieving the vendor
 */


router.get("/vendor/getOneVendor/:vendorId", getOneVendor)




/**
 * @swagger
 * /api/v1/vendor/verify-otp:
 *   post:
 *     summary: Verify user account using OTP
 *     description: Validates a user's OTP and marks their account as verified if successful.
 *     tags: [User]
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
 *                 example: user@example.com
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
 *                   example: user@example.com
 *                 message:
 *                   type: string
 *                   example: Otp verified successfully
 *       400:
 *         description: Invalid or expired OTP / User already verified
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
 */


// router.post("/vendor/verify-otp", verifyOtp)








/**
 * @swagger
 * /api/vendor/forgot-password-otp-resend:
 *   post:
 *     summary: Resend Forgot Password OTP for Vendor
 *     description: Sends a new one-time password (OTP) to the vendor's registered business email for password reset. The OTP is valid for 5 minutes.
 *     tags:
 *       - Vendor Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - businessEmail
 *             properties:
 *               businessEmail:
 *                 type: string
 *                 format: email
 *                 example: vendor@example.com
 *     responses:
 *       200:
 *         description: Forgot password OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: forgot password request sent
 *       404:
 *         description: Vendor not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vendor not found
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

router.post("/vendor/forgot-password-otp-resend", vendorForgotPasswordOtpResend)






module.exports = router

