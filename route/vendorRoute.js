const express = require ('express');
const { vendorAuthentication } = require ('../middleware/authentication');
const { vendorSignUp } = require('../controller/vendorController');

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
 *                 example: digbanshop@gmail.com
 *               businessPhoneNumber:
 *                 type: string
 *                 example: 09055674321
 *               businessAddress:
 *                 type: string
 *                 example: 15 Adeniyi Jones, Ikeja Lagos
 *               firstName:
 *                 type: string
 *                 example: Mije
 *               lastName:
 *                 type: string
 *                 example: Digban
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
 *                       example: Mije
 *                     lastName:
 *                       type: string
 *                       example: Digban
 *                     businessEmail:
 *                       type: string
 *                       example: digbanshop@gmail.com
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


module.exports = router