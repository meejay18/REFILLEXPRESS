const express = require ('express');
const { vendorAuthentication } = require ('../middleware/authentication');
const { vendorSignUp, verifyVendor, resendVendorOtp, Vendorlogin, vendorForgotPassword, vendorResetPassword, changeVendorPassword, getAllvendors, getOneVendor, vendorForgotPasswordOtpResend, verifyVendorForgotPasswordOtp } = require('../controller/vendorController');
const { verifyOtp } = require('../controller/userController');

const router = express.Router();



/**
 * @swagger
 * /vendor:
 *   post:
 *     summary: Create a new vendor account
 *     tags: [Vendor]
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
 * /vendor/verify:
 *   post:
 *     summary: Verify vendor account using OTP
 *     tags: [Vendor]
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
 * /vendor/resend-otp:
 *   post:
 *     summary: Resend OTP to vendor's business email
 *     tags: [Vendor]
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
router.post('/vendor/resend-otp', resendVendorOtp);

/**
 * @swagger
 * /vendor/login:
 *   post:
 *     summary: Login vendor account
 *     tags: [Vendor]
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
 * /vendor/forgot-password:
 *   post:
 *     summary: Vendor Forgot Password Request
 *     description: Initiates the password reset process for a vendor by sending a one-time password (OTP) to their registered business email. The OTP is valid for 5 minutes.
 *     tags:
 *       - Vendor
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
 * /vendor/verify-forgot-password-otp:
 *   post:
 *     summary: Verify OTP for vendor forgot password
 *     tags: [Vendor]
 *     description: Vendor validates OTP sent to their business email for password reset. Returns a reset token if OTP is correct and valid.
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
 *                 example: vendor@example.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully, reset token issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   example: vendor@example.com
 *                 message:
 *                   type: string
 *                   example: Otp verified successfully
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 *       400:
 *         description: Invalid or expired OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     invalidOtp:
 *                       summary: Invalid OTP entered
 *                       value: Invalid otp
 *                     expiredOtp:
 *                       summary: OTP already expired
 *                       value: otp expired, please request a new one
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
router.post('/vendor/verify-forgot-password-otp', verifyVendorForgotPasswordOtp);




/**
 * @swagger
 * /vendor/reset-password:
 *   post:
 *     summary: Reset Vendor Password
 *     description: Allows a vendor to reset their password using their registered business email after OTP verification.
 *     tags:
 *       - Vendor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - businessEmail
 *               - newPassword
 *             properties:
 *               businessEmail:
 *                 type: string
 *                 format: email
 *                 description: The vendor's registered business email.
 *                 example: vendor@example.com
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */


router.post('/vendor/reset-password', vendorResetPassword);


/**
 * @swagger
 * /vendor/change-password:
 *   patch:
 *     summary: Change vendor password
 *     tags: [Vendor]
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
 * /vendor/getAllvendors:
 *   get:
 *     summary: Retrieve all vendors
 *     description: Fetches all registered vendors from the database.
 *     tags: [Vendor]
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
 * /vendor/getOneVendor/{vendorId}:
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
 * /vendor/vendorForgotPasswordOtpResend:
 *   post:
 *     summary: Resend Vendor Forgot Password OTP
 *     description: Resends a new one-time password (OTP) to the vendor's registered business email for password reset. The OTP expires after 5 minutes.
 *     tags:
 *       - Vendor
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
 *         description: Forgot password OTP resent successfully
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


router.post("/vendor/vendorForgotPasswordOtpResend", vendorForgotPasswordOtpResend)

// router.post("/vendor/verify-otp", verifyOtp)



module.exports = router

