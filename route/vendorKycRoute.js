const express = require('express')
const {
  vendorAuthentication,
  authentication,
  adminOnly,
} = require('../middleware/authentication')
const upload = require('../middleware/multer')
const { submitVendorKyc, updateVendorKyc, verifyVendorKyc, getAllvendorKyc, getOneVendorKyc } = require('../controller/vendorKycController')

const router = express.Router()

const kycUpload = upload.fields([
  { name: 'businessLicense', maxCount: 1 },
  { name: 'taxRegistrationCertificate', maxCount: 1 },
  { name: 'nationalId', maxCount: 1 },
  { name: 'businessInsurance', maxCount: 1 },
])

/**
 * @swagger
 * /vendorKyc:
 *   post:
 *     summary: Submit Vendor KYC
 *     description: Allows a vendor to submit KYC details along with required business documents. All files are uploaded to Cloudinary.
 *     tags:
 *       - Vendor KYC
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - vendorId
 *               - bankAccountName
 *               - bankName
 *               - accountNumber
 *               - businessLicense
 *               - taxRegistrationCertificate
 *               - nationalId
 *               - businessInsurance
 *             properties:
 *               vendorId:
 *                 type: string
 *                 description: The unique ID of the vendor.
 *                 example: 8a92bc43-1b3a-4d9e-b9de-1f2320e6a7f4
 *               bankAccountName:
 *                 type: string
 *                 example: John Doe Enterprises
 *               bankName:
 *                 type: string
 *                 example: Access Bank
 *               accountNumber:
 *                 type: string
 *                 example: "0123456789"
 *               businessLicense:
 *                 type: string
 *                 format: binary
 *                 description: Upload the business license document.
 *               taxRegistrationCertificate:
 *                 type: string
 *                 format: binary
 *                 description: Upload the tax registration certificate.
 *               nationalId:
 *                 type: string
 *                 format: binary
 *                 description: Upload the national ID document.
 *               businessInsurance:
 *                 type: string
 *                 format: binary
 *                 description: Upload the business insurance document.
 *     responses:
 *       201:
 *         description: KYC created successfully
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
 *                       example: a3b7c12e-dfc8-47f4-8e9c-4dcb8e0295b2
 *                     vendorId:
 *                       type: string
 *                       example: 8a92bc43-1b3a-4d9e-b9de-1f2320e6a7f4
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
 *                     bankAccountName:
 *                       type: string
 *                       example: John Doe Enterprises
 *                     bankName:
 *                       type: string
 *                       example: Access Bank
 *                     accountNumber:
 *                       type: string
 *                       example: "0123456789"
 *       404:
 *         description: KYC already exists for this vendor
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
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


router.get("/vendorKyc/getAllVendorKyc", authentication, adminOnly, getAllvendorKyc)




/**
 * @swagger
 * /vendorKyc/getOneVendorKyc/{vendorId}:
 *   get:
 *     summary: Get One Vendor KYC
 *     description: Retrieves detailed KYC information for a specific vendor by their vendorId. Requires vendor authentication.
 *     tags:
 *       - Vendor KYC
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vendorId
 *         required: true
 *         description: Unique identifier of the vendor
 *         schema:
 *           type: string
 *           example: "f0a3c1c9-89e1-4a77-9d3d-68b4f89b8e12"
 *     responses:
 *       200:
 *         description: Vendor KYC record retrieved successfully
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
 *                       example: "f0a3c1c9-89e1-4a77-9d3d-68b4f89b8e12"
 *                     businessName:
 *                       type: string
 *                       example: "Refill Express Logistics"
 *                     businessEmail:
 *                       type: string
 *                       example: "vendor@example.com"
 *                     verificationStatus:
 *                       type: string
 *                       example: "pending"
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
 *       401:
 *         description: Unauthorized or invalid token
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


router.get("/vendorKyc/getOneVendorKyc/:vendorId", vendorAuthentication,  getOneVendorKyc)
module.exports = router
