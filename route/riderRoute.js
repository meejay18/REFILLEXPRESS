const express = require ('express');
// const { vendorAuthentication } = require ('../middleware/authentication');
const {RiderSignUp} = require('../controller/riderController');

const router = express.Router();

/**
 * @swagger
 * /rider:
 *   post:
 *     summary: Register a new rider
 *     description: |
 *       This endpoint allows a new rider to sign up by providing their details.  
 *       After successful registration, an OTP is sent to the rider's email for verification.
 *     tags:
 *       - Rider 
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
 *               - operatingArea
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@example.com"
 *               phoneNumber:
 *                 type: string
 *                 example: "+2348012345678"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "RiderPass123"
 *               operatingArea:
 *                 type: string
 *                 example: "Lagos Mainland"
 *     responses:
 *       201:
 *         description: Rider registered successfully.
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
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *       400:
 *         description: Rider with the given email already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rider already exists
 *       500:
 *         description: Internal server error.
 */

router.post('/rider', RiderSignUp)

module.exports = router