const express = require('express')
const { vendorAuthentication, authentication, adminOnly } = require('../middleware/authentication')
const upload = require('../middleware/multer')
const {
  submitVendorKyc,
  updateVendorKyc,
  verifyVendorKyc,
  getAllvendorKyc,
  getOneVendorKyc,
} = require('../controller/vendorKycController')

const router = express.Router()

const kycUpload = upload.fields([
  { name: 'businessLicense', maxCount: 1 },
  { name: 'taxRegistrationCertificate', maxCount: 1 },
  { name: 'nationalId', maxCount: 1 },
  { name: 'businessInsurance', maxCount: 1 },
])

/**
 * @swagger
 * /vendorkyc/{vendorId}:
 *   post:
 *     summary: Submit vendor KYC
 *     description: Allows a verified vendor to submit KYC details and required business documents.
 *     tags:
 *       - Vendor KYC
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: vendorId
 *         in: path
 *         required: true
 *         description: Unique ID of the vendor submitting KYC
 *         schema:
 *           type: string
 *           example: 6c9a8f91-86c3-4b4a-b12d-f2411f582bf7
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - businessLicense
 *               - taxRegistrationCertificate
 *               - nationalId
 *               - businessInsurance
 *               - bankAccountName
 *               - bankName
 *               - accountNumber
 *             properties:
 *               businessLicense:
 *                 type: string
 *                 format: binary
 *                 description: Upload of the business license document
 *               taxRegistrationCertificate:
 *                 type: string
 *                 format: binary
 *                 description: Upload of the tax registration certificate document
 *               nationalId:
 *                 type: string
 *                 format: binary
 *                 description: Upload of the national ID document
 *               businessInsurance:
 *                 type: string
 *                 format: binary
 *                 description: Upload of the business insurance document
 *               bankAccountName:
 *                 type: string
 *                 example: John Doe Enterprises
 *               bankName:
 *                 type: string
 *                 example: Access Bank
 *               accountNumber:
 *                 type: string
 *                 example: 0123456789
 *     responses:
 *       201:
 *         description: KYC submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Kyc created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 7d3b6b90-3211-4b85-b612-1af4f935c18c
 *                     vendorId:
 *                       type: string
 *                       example: 6c9a8f91-86c3-4b4a-b12d-f2411f582bf7
 *                     businessLicense:
 *                       type: string
 *                       example: https://res.cloudinary.com/.../businessLicense.jpg
 *                     taxRegistrationCertificate:
 *                       type: string
 *                       example: https://res.cloudinary.com/.../taxRegistrationCertificate.jpg
 *                     nationalId:
 *                       type: string
 *                       example: https://res.cloudinary.com/.../nationalId.jpg
 *                     businessInsurance:
 *                       type: string
 *                       example: https://res.cloudinary.com/.../businessInsurance.jpg
 *                     bankAccountName:
 *                       type: string
 *                       example: John Doe Enterprises
 *                     bankName:
 *                       type: string
 *                       example: Access Bank
 *                     accountNumber:
 *                       type: string
 *                       example: 0123456789
 *       400:
 *         description: Missing or invalid fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All fields are required
 *       404:
 *         description: KYC already exists or vendor not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Kyc already exists for this vendor
 *       500:
 *         description: Internal server error
 */

router.post('/vendorkyc/:vendorId', vendorAuthentication, kycUpload, submitVendorKyc)

/**
 * @swagger
 * /vendorKyc/{vendorId}:
 *   put:
 *     summary: Update Vendor KYC
 *     description: Updates an existing vendor's KYC record. Only unverified KYCs can be updated. Supports both file and text field updates.
 *     tags:
 *       - Vendor KYC
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vendorId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the vendor whose KYC record should be updated.
 *         example: 8a92bc43-1b3a-4d9e-b9de-1f2320e6a7f4
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               bankAccountName:
 *                 type: string
 *                 example: John Doe Enterprises
 *               bankName:
 *                 type: string
 *                 example: Access Bank
 *               accountNumber:
 *                 type: string
 *                 example: "0123456789"
 *               automaticPayouts:
 *                 type: boolean
 *                 example: true
 *               businessLicense:
 *                 type: string
 *                 format: binary
 *                 description: Upload a new business license document (optional).
 *               taxRegistrationCertificate:
 *                 type: string
 *                 format: binary
 *                 description: Upload a new tax registration certificate (optional).
 *               nationalId:
 *                 type: string
 *                 format: binary
 *                 description: Upload a new national ID document (optional).
 *               businessInsurance:
 *                 type: string
 *                 format: binary
 *                 description: Upload a new business insurance document (optional).
 *     responses:
 *       200:
 *         description: KYC updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Kyc updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: a3b7c12e-dfc8-47f4-8e9c-4dcb8e0295b2
 *                     vendorId:
 *                       type: string
 *                       example: 8a92bc43-1b3a-4d9e-b9de-1f2320e6a7f4
 *                     bankAccountName:
 *                       type: string
 *                       example: John Doe Enterprises
 *                     bankName:
 *                       type: string
 *                       example: Access Bank
 *                     accountNumber:
 *                       type: string
 *                       example: "0123456789"
 *                     automaticPayouts:
 *                       type: boolean
 *                       example: true
 *                     businessLicense:
 *                       type: string
 *                       example: https://res.cloudinary.com/demo/image/upload/v12345/business_license.jpg
 *                     taxRegistrationCertificate:
 *                       type: string
 *                       example: https://res.cloudinary.com/demo/image/upload/v12345/tax_cert.jpg
 *                     nationalId:
 *                       type: string
 *                       example: https://res.cloudinary.com/demo/image/upload/v12345/national_id.jpg
 *                     businessInsurance:
 *                       type: string
 *                       example: https://res.cloudinary.com/demo/image/upload/v12345/insurance.jpg
 *       403:
 *         description: KYC cannot be updated due to verification status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Kyc is already verified and cannot be updated
 *       404:
 *         description: KYC not found for this vendor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Kyc not found for this vendor
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

router.put('/vendorKyc/:vendorId', vendorAuthentication, kycUpload, updateVendorKyc)

/**
 * @swagger
 * /vendorKyc/verify/{vendorId}:
 *   post:
 *     summary: Verify or reject a vendor's KYC
 *     description: Allows an authenticated admin to verify or reject a vendor’s KYC record. Once verified, an email notification is sent to the vendor.
 *     tags:
 *       - Vendor KYC
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: vendorId
 *         in: path
 *         required: true
 *         description: Unique ID of the vendor whose KYC is being verified.
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       description: Verification status to update for the vendor KYC.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               verificationStatus:
 *                 type: string
 *                 enum: [verified, rejected]
 *                 description: Status to update the KYC with.
 *             example:
 *               verificationStatus: verified
 *     responses:
 *       200:
 *         description: KYC verification status updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Kyc updated successfully
 *                 data:
 *                   type: object
 *                   description: Updated KYC record
 *       400:
 *         description: Invalid verification status provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid validation status
 *       403:
 *         description: KYC is already verified and cannot be updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Kyc is already verified
 *       404:
 *         description: KYC record not found for the specified vendor ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Kyc record not found for this vendor
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

router.post('/vendorKyc/verify/:vendorId', authentication, adminOnly, verifyVendorKyc)

/**
 * @swagger
 * /vendorKyc/getAllVendorKyc:
 *   get:
 *     summary: Get All Vendor KYCs
 *     description: Retrieves all vendor KYC records in the system. Only accessible to admin users.
 *     tags:
 *       - Vendor KYC
 *     security:
 *       - bearerAuth: []
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
 *                         example: "f0a3c1c9-89e1-4a77-9d3d-68b4f89b8e12"
 *                       businessName:
 *                         type: string
 *                         example: "Refill Express Logistics"
 *                       businessEmail:
 *                         type: string
 *                         example: "vendor@example.com"
 *                       verificationStatus:
 *                         type: string
 *                         example: "pending"
 *       404:
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
 *       401:
 *         description: Unauthorized or invalid admin token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized access
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

router.get('/vendorKyc/getAllVendorKyc', authentication, adminOnly, getAllvendorKyc)


/**
 * @swagger
 * /vendorKyc/getOneVendorKyc/{vendorId}:
 *   get:
 *     summary: Retrieve a specific vendor's KYC details
 *     description: Fetch a vendor and their associated KYC details using the vendor's unique ID.
 *     tags: [Vendor KYC]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vendorId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the vendor.
 *         example: aab205f6-c745-47e7-9ee9-239322aceab4
 *     responses:
 *       200:
 *         description: Vendor KYC retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Vendor retrieved successfully
 *               data:
 *                 id: "aab205f6-c745-47e7-9ee9-239322aceab4"
 *                 firstName: "John"
 *                 lastName: "Doe"
 *                 businessEmail: "johndoe@example.com"
 *                 kyc:
 *                   businessLicense: "https://res.cloudinary.com/refillxpress/businessLicense.jpg"
 *                   taxRegistrationCertificate: "https://res.cloudinary.com/refillxpress/taxCert.jpg"
 *                   nationalId: "https://res.cloudinary.com/refillxpress/nationalId.jpg"
 *                   businessInsurance: "https://res.cloudinary.com/refillxpress/insurance.jpg"
 *                   verificationStatus: "verified"
 *       404:
 *         description: Vendor not found
 *         content:
 *           application/json:
 *             example:
 *               message: Vendor not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal server error
 */


router.get('/vendorKyc/getOneVendorKyc/:vendorId', vendorAuthentication, getOneVendorKyc)
module.exports = router
