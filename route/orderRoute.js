const express = require('express')
const {
  placeOrder,
  getRecentOrders,
  getAllVendorOrders,
  getActiveOrders,
  getOrderByStatus,
  acceptOrder,
} = require('../controller/orderController')
const { authentication, vendorAuthentication, riderAuthentication } = require('../middleware/authentication')
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
 *               - cylinderSize
 *               - quantity
 *               - deliveryAddress
 *             properties:
 *               cylinderSize:
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

router.get('/order/getRecentOrders', authentication, getRecentOrders)

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

router.get('/order/getAllVendorOrders', vendorAuthentication, getAllVendorOrders)

/**
 * @swagger
 * /orders/getActiveOrders/{userId}:
 *   get:
 *     summary: Get all active orders for a user
 *     description: Retrieves all active orders belonging to a specific authenticated user.
 *     tags:
 *       - User Dashboard
 *     security:
 *       - bearerAuth: []   # JWT authentication
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The unique ID of the user whose active orders are being fetched
 *         schema:
 *           type: string
 *           example: 2f7f7b34-7b31-4c6a-9a98-9dcae3e20455
 *     responses:
 *       200:
 *         description: Active orders fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Active orders fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 5e6bba15-9e91-4a63-bf1a-dac6bdb3e88a
 *                       orderNumber:
 *                         type: string
 *                         example: ORD-20251027-001
 *                       status:
 *                         type: string
 *                         example: active
 *                       totalPrice:
 *                         type: number
 *                         example: 4500.00
 *                       quantity:
 *                         type: integer
 *                         example: 3
 *                       vendor:
 *                         type: object
 *                         properties:
 *                           businessName:
 *                             type: string
 *                             example: GreenMart Foods
 *       404:
 *         description: User not found or has no active orders
 *       500:
 *         description: Internal server error
 */

router.get('/orders/getActiveOrders/:userId', authentication, getActiveOrders)

/**
 * @swagger
 * /orders/getOrderByStatus:
 *   get:
 *     summary: Get all user orders grouped by status
 *     description: Retrieves all orders for the authenticated user grouped by status (pending, active, completed, cancelled).
 *     tags:
 *       - User Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders grouped successfully by status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Orders grouped by status
 *                 data:
 *                   type: object
 *                   properties:
 *                     pending:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: 9b13e256-8a6a-4b28-8d9e-8f66b3f8a6c4
 *                           orderNumber:
 *                             type: string
 *                             example: REF-20251027-001
 *                           gasType:
 *                             type: string
 *                             example: LPG
 *                           quantity:
 *                             type: number
 *                             example: 10
 *                           totalPrice:
 *                             type: number
 *                             example: 15000
 *                           deliveryAddress:
 *                             type: string
 *                             example: 23 Allen Avenue, Ikeja, Lagos
 *                           status:
 *                             type: string
 *                             example: pending
 *                           vendor:
 *                             type: object
 *                             properties:
 *                               businessName:
 *                                 type: string
 *                                 example: Gas Express
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
 *         description: Unauthorized — missing or invalid token
 *       500:
 *         description: Internal server error
 */

router.get('/orders/getOrderByStatus', authentication, getOrderByStatus)



/**
 * @swagger
 * /orders/acceptOrder/{orderId}:
 *   get:
 *     summary: Rider accepts an order
 *     description: Allows a rider to accept an available (pending) order and mark it as active.
 *     tags:
 *       - Rider Dashboard
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: The unique ID of the order to accept
 *         schema:
 *           type: string
 *           example: "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8"
 *     responses:
 *       200:
 *         description: Order accepted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order accepted successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "d7e5a6c1-4f9a-4a34-9e3b-3a2215bbf4cd"
 *                     status:
 *                       type: string
 *                       example: active
 *                     riderId:
 *                       type: string
 *                       example: "rider1234"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-27T10:25:30.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-27T10:30:00.000Z"
 *       400:
 *         description: Order not available for acceptance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No order for acceptance
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order not found
 */


router.get('/orders/acceptOrder/:orderId', riderAuthentication, acceptOrder)
module.exports = router
