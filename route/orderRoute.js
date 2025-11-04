const express = require('express')
const { placeOrder, getRecentOrders, getAllVendorOrders } = require('../controller/orderController')
const { authentication, vendorAuthentication } = require('../middleware/authentication')
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
 *                     cylinderSize:
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



/**
 * @swagger
 * /order/getRecentOrders:
 *   get:
 *     summary: Retrieve recent user orders
 *     description: Fetches the 5 most recent orders placed by the authenticated user, sorted by creation date in descending order.
 *     tags:
 *       - User Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: recent orders retrieved
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 123e4567-e89b-12d3-a456-426614174000
 *                       orderNumber:
 *                         type: string
 *                         example: REF-20251027-458
 *                       gasType:
 *                         type: string
 *                         example: LPG
 *                       quantity:
 *                         type: number
 *                         example: 12
 *                       totalPrice:
 *                         type: number
 *                         example: 7800
 *                       deliveryAddress:
 *                         type: string
 *                         example: 10 Chief Nwuke Street, Port Harcourt
 *                       status:
 *                         type: string
 *                         example: pending
 *                       paymentStatus:
 *                         type: string
 *                         example: unpaid
 *                       createdAt:
 *                         type: string
 *                         example: 2025-10-27T12:45:00Z
 *                       vendor:
 *                         type: object
 *                         properties:
 *                           businessName:
 *                             type: string
 *                             example: GasPoint Ventures
 *       401:
 *         description: Unauthorized — missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Internal server error
 */


router.get("/order/getRecentOrders", authentication, getRecentOrders )

/**
 * @swagger
 * /order/getAllVendorOrders:
 *   get:
 *     summary: Retrieve all orders for a vendor grouped by status
 *     description: This endpoint allows an authenticated vendor to view all their orders grouped into pending, active, completed, and cancelled categories.
 *     tags: [Vendor Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully and grouped by status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Orders retrieved by status
 *                 data:
 *                   type: object
 *                   properties:
 *                     pending:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Order'
 *                     active:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Order'
 *                     completed:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Order'
 *                     cancelled:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized — Vendor authentication token missing or invalid
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 4a0b12de-cc7a-4a3e-b83e-9912b55b26e0
 *         orderNumber:
 *           type: string
 *           example: REF-20251027-123
 *         gasType:
 *           type: string
 *           example: LPG
 *         quantity:
 *           type: number
 *           example: 12
 *         price:
 *           type: number
 *           example: 1500
 *         totalPrice:
 *           type: number
 *           example: 18000
 *         deliveryAddress:
 *           type: string
 *           example: 23 Marina Road, Lagos, Nigeria
 *         status:
 *           type: string
 *           enum: [pending, active, completed, cancelled]
 *           example: pending
 *         paymentStatus:
 *           type: string
 *           enum: [paid, unpaid]
 *           example: unpaid
 *         createdAt:
 *           type: string
 *           format: date-time
 *         user:
 *           type: object
 *           properties:
 *             firstName:
 *               type: string
 *               example: John
 *             lastName:
 *               type: string
 *               example: Doe
 *             email:
 *               type: string
 *               example: johndoe@gmail.com
 */



router.get("/order/getAllVendorOrders", vendorAuthentication, getAllVendorOrders)
module.exports = router
