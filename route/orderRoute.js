const express = require('express')
const { placeOrder } = require('../controller/orderController')
const { authentication } = require('../middleware/authentication')
const router = express.Router()



/**
 * @swagger
 * /order/create-order:
 *   post:
 *     summary: Place a new gas order
 *     description: Allows an authenticated user to place a gas order with the nearest available vendor.
 *     tags:
 *       - User Dashboard
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gasType
 *               - quantity
 *               - deliveryAddress
 *             properties:
 *               gasType:
 *                 type: string
 *                 example: LPG
 *               quantity:
 *                 type: number
 *                 example: 12
 *               deliveryAddress:
 *                 type: string
 *                 example: 10 Chief Nwuke Street, Port Harcourt
 *               scheduledTime:
 *                 type: string
 *                 example: 2025-10-29T14:00:00Z
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order created successfully, A rider will contact you shortly to complete your order
 *                 order:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 123e4567-e89b-12d3-a456-426614174000
 *                     orderNumber:
 *                       type: string
 *                       example: REF-20251027-458
 *                     gasType:
 *                       type: string
 *                       example: LPG
 *                     quantity:
 *                       type: number
 *                       example: 12
 *                     price:
 *                       type: number
 *                       example: 650
 *                     totalPrice:
 *                       type: number
 *                       example: 7800
 *                     deliveryFee:
 *                       type: number
 *                       example: 2500
 *                     deliveryAddress:
 *                       type: string
 *                       example: 10 Chief Nwuke Street, Port Harcourt
 *                     status:
 *                       type: string
 *                       example: pending
 *                     paymentStatus:
 *                       type: string
 *                       example: unpaid
 *       400:
 *         description: Missing or invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All fields are required
 *       404:
 *         description: Vendor or user not found / No available vendors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No available vendors at the moment
 *       500:
 *         description: Internal server error
 */


router.post('/order/create-order', authentication, placeOrder)

module.exports = router
