const express = require('express')
const { submitRiderKyc } = require('../controller/riderKycController')
const { riderAuthentication } = require('../middleware/authentication')
const upload = require('../middleware/multer')
const router = express.Router()

const riderKycUpload = upload.fields([
  {
    name: 'driversLicense',
    maxCount: 2,
  },
  {
    name: 'vehicleRegistration',
    maxCount: 2,
  },
  {
    name: 'ownerIdCard',
    maxCount: 2,
  },
  {
    name: 'utilityBill',
    maxCount: 2,
  },
])


/**
 * @swagger
 * /rider/riderKyc/{riderId}:
 *   post:
 *     summary: Submit Rider KYC
 *     description: Allows a rider to submit KYC details including personal information, vehicle information, and required document uploads.
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
 *         description: Unique ID of the rider.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - city
 *               - residentialAddress
 *               - state
 *               - contactName
 *               - contactPhone
 *               - vehicleType
 *               - vehicleMake
 *               - vehicleModel
 *               - year
 *               - registrationNumber
 *               - licensePlate
 *               - accountHolderName
 *               - bankName
 *               - accountNumber
 *               - driversLicense
 *               - vehicleRegistration
 *               - ownerIdCard
 *               - utilityBill
 *             properties:
 *               city:
 *                 type: string
 *                 example: Lagos
 *               residentialAddress:
 *                 type: string
 *                 example: 24, Allen Avenue, Ikeja
 *               state:
 *                 type: string
 *                 example: Lagos State
 *               contactName:
 *                 type: string
 *                 example: James Doe
 *               contactPhone:
 *                 type: string
 *                 example: +2348012345678
 *               vehicleType:
 *                 type: string
 *                 example: Motorcycle
 *               vehicleMake:
 *                 type: string
 *                 example: Honda
 *               vehicleModel:
 *                 type: string
 *                 example: CBR 250R
 *               year:
 *                 type: integer
 *                 example: 2021
 *               registrationNumber:
 *                 type: string
 *                 example: ABC123XYZ
 *               licensePlate:
 *                 type: string
 *                 example: KJA-2345BD
 *               accountHolderName:
 *                 type: string
 *                 example: James Doe
 *               bankName:
 *                 type: string
 *                 example: Access Bank
 *               accountNumber:
 *                 type: string
 *                 example: 0123456789
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
 *         description: Rider KYC submitted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rider kyc submitted
 *                 data:
 *                   type: object
 *                   properties:
 *                     riderId:
 *                       type: string
 *                       example: 6e89b9f0-45e3-4cfa-9df9-53b0328f1349
 *                     city:
 *                       type: string
 *                       example: Lagos
 *                     residentialAddress:
 *                       type: string
 *                       example: 24, Allen Avenue, Ikeja
 *                     vehicleType:
 *                       type: string
 *                       example: Motorcycle
 *                     driversLicense:
 *                       type: string
 *                       example: https://res.cloudinary.com/demo/image/upload/drivers_license.jpg
 *                     vehicleRegistration:
 *                       type: string
 *                       example: https://res.cloudinary.com/demo/image/upload/vehicle_registration.jpg
 *                     ownerIdCard:
 *                       type: string
 *                       example: https://res.cloudinary.com/demo/image/upload/id_card.jpg
 *                     utilityBill:
 *                       type: string
 *                       example: https://res.cloudinary.com/demo/image/upload/utility_bill.jpg
 *       400:
 *         description: Bad request — Invalid or missing fields.
 *       404:
 *         description: KYC already exists for this rider.
 *       500:
 *         description: Internal server error.
 */


router.post('/rider/riderKyc/:riderId', riderKycUpload, submitRiderKyc)

module.exports = router
