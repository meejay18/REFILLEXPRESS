const express = require ('express');
// const { vendorAuthentication } = require ('../middleware/authentication');
const {RiderSignUp} = require('../controller/riderController');

const router = express.Router();



/**
 * @swagger
 * /rider:
 *   post:
 *     summary: Create a new rider account
 *     tags: [Rider]
 *     description: Endpoint for signing up a new rider.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - password
 *               - emailAddress
 *               - phoneNumber
 *               - operatingArea
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Digban 
 *               lastName:
 *                 type: string
 *                 example: Deke
 *               emailAddress:
 *                 type: string
 *                 example: Martinsdeke@gmail.com
 *               phoneNumber:
 *                 type: string
 *                 example: 09069412639
 *               password:
 *                 type: string
 *                 example: StrongPassword123!
 *               operatingArea:
 *                 type: string
 *                 example: Magodo
 *     responses:
 *       201:
 *         description: Rider successfully created
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
 *                       example: Martins
 *                     lastName:
 *                       type: string
 *                       example: Deke
 *                     emailAddress:
 *                       type: string
 *                       example: Martinsdeke@gmail.com
 *                     operatingArea:
 *                       type: string
 *                       example: Magodo
 *                     phoneNumber:
 *                       type: string
 *                       example: 09069412639
 *                     password:
 *                       type: string
 *                       example: StrongPassword123!
 *       400:
 *         description: Rider already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rider already exists
 */
router.post('/rider', RiderSignUp)

module.exports = router