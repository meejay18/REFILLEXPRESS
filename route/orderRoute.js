const express = require('express')
const {
  placeOrder,
  getRecentOrders,
  getAllVendorOrders,
  getActiveOrders,
  getOrderByStatus,
  confirmOrder,
  deleteOrder,
  cancelOrder,
  completeOrder,
  getAllOrders,
  getOneOrder,
  trackOrder,
  getUserOrderTracking,
} = require('../controller/orderController')
const {
  authentication,
  vendorAuthentication,
  riderAuthentication,
  adminOnly,
} = require('../middleware/authentication')
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

router.post('/order/create-order/:vendorId', authentication, placeOrder)

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
 * /orders/confirmOrder/{orderId}:
 *   post:
 *     tags:
 *       - Rider Dashboard
 *     summary: Confirm an order and assign it to the rider
 *     description: |
 *       Allows an authenticated rider to confirm a customer's order.  
 *       The order is assigned to the rider and a 6-digit OTP is generated and emailed to the customer.
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: The unique ID of the order to confirm
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Order confirmed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order confirmed successfully
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *
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
 *
 *       500:
 *         description: Server error
 */


router.post('/orders/confirmOrder/:orderId', riderAuthentication, confirmOrder)

/**
 * @swagger
 * /orders/deleteOrder/{orderId}:
 *   delete:
 *     summary: Delete a user's order (Admin only)
 *     description: Allows an authenticated admin to delete a user's order, provided the order has not yet been completed or delivered.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the order to delete.
 *     responses:
 *       200:
 *         description: Order deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: order deleted successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 2d4c3d6e-8c76-49a5-9a1e-1f6b8e2d4f90
 *                     userId:
 *                       type: string
 *                       example: 123e4567-e89b-12d3-a456-426614174000
 *                     status:
 *                       type: string
 *                       example: pending
 *                     totalPrice:
 *                       type: number
 *                       example: 1500.75
 *                     quantity:
 *                       type: number
 *                       example: 5
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-10-27T12:34:56.000Z
 *       400:
 *         description: Cannot delete an order that has already been completed or delivered.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: You cannot delete an order that has already been completed or delivered
 *       403:
 *         description: Forbidden — user is not an admin.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access denied. Admins only.
 *       404:
 *         description: Order not found or does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order does not exist
 *       500:
 *         description: Internal server error.
 */

router.delete('/orders/deleteOrder/:orderId', authentication, adminOnly, deleteOrder)

/**
 * @swagger
 * /orders/{orderId}/cancel:
 *   patch:
 *     summary: Cancel an existing order
 *     description: Allows an authenticated user to cancel their order if it has not yet been completed or delivered.
 *     tags:
 *       - User Dashboard
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the order to cancel.
 *     responses:
 *       200:
 *         description: Order cancelled successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order cancelled successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 2d4c3d6e-8c76-49a5-9a1e-1f6b8e2d4f90
 *                     status:
 *                       type: string
 *                       example: cancelled
 *                     userId:
 *                       type: string
 *                       example: 123e4567-e89b-12d3-a456-426614174000
 *                     totalPrice:
 *                       type: number
 *                       example: 3500.50
 *                     quantity:
 *                       type: number
 *                       example: 2
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-10-27T10:15:30.000Z
 *       400:
 *         description: The order cannot be cancelled because it has been delivered or completed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: You cannot cancel a completed or delivered order
 *       404:
 *         description: The order was not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order not found
 *       401:
 *         description: Unauthorized — missing or invalid authentication token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized access. Please log in.
 *       500:
 *         description: Internal server error.
 */

router.patch('/orders/:orderId/cancel', authentication, cancelOrder)

/**
 * @swagger
 * /rider/complete/order/{orderId}:
 *   patch:
 *     summary: Mark an active order as completed
 *     description: Allows an authenticated rider to mark an active order as completed. Sends a confirmation email to the user after successful completion.
 *     tags: [Rider Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: The unique ID of the order to complete
 *         schema:
 *           type: string
 *           example: "a8b1c2d3-1234-5678-90ef-abcdef123456"
 *     responses:
 *       200:
 *         description: Order marked as completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order marked as completed
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid request — only active orders can be completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Only active orders can be completed
 *       404:
 *         description: Order not found or unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order not found or unauthorized
 *       401:
 *         description: Unauthorized — rider not authenticated
 *       500:
 *         description: Internal server error
 */

router.patch('/rider/complete/order/:orderId', riderAuthentication, completeOrder)

/**
 * @swagger
 * /orders/getAllorders:
 *   get:
 *     summary: Get all orders
 *     description: Retrieve a list of all orders from the database.
 *     tags:
 *       - Rider Dashboard
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Orders retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 12
 *                       orderNumber:
 *                         type: string
 *                         example: ORD-123456
 *                       userId:
 *                         type: integer
 *                         example: 5
 *                       riderId:
 *                         type: integer
 *                         example: 2
 *                       status:
 *                         type: string
 *                         example: pending
 *                       totalPrice:
 *                         type: number
 *                         format: float
 *                         example: 4500.75
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-10-27T12:34:56.000Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-10-27T14:20:30.000Z
 *       404:
 *         description: No orders found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No orders found
 *       500:
 *         description: Internal server error
 */

router.get('/orders/getAllorders', getAllOrders)

/**
 * @swagger
 * /orders/getOneOrder/{orderId}:
 *   get:
 *     summary: Get details of a specific order
 *     description: Retrieve details of a single order by its ID.
 *     tags:
 *       - Rider Dashboard
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the order to retrieve
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 12
 *                     orderNumber:
 *                       type: string
 *                       example: ORD-123456
 *                     userId:
 *                       type: integer
 *                       example: 5
 *                     riderId:
 *                       type: integer
 *                       example: 2
 *                     status:
 *                       type: string
 *                       example: completed
 *                     totalPrice:
 *                       type: number
 *                       format: float
 *                       example: 3500.50
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-10-27T12:34:56.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-10-27T14:20:30.000Z
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
 *       500:
 *         description: Internal server error
 */

router.get('/orders/getOneOrder/:orderId', getOneOrder)


/**
 * @swagger
 * /order/tracking/{orderId}/status:
 *   put:
 *     tags:
 *       - Rider Orders
 *     summary: Update the tracking status of an order
 *     description: Allows an authenticated rider to update the orderStatus of an assigned order.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: ID of the order to update
 *         schema:
 *           type: string
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderStatus
 *             properties:
 *               orderStatus:
 *                 type: string
 *                 enum:
 *                   - navigatingToCustomer
 *                   - pickedUpCylinder
 *                   - navigatingToVendor
 *                   - refillingCylinder
 *                   - returningToCustomer
 *                   - completed
 *                 example: navigatingToCustomer
 *
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order tracking updated to navigatingToCustomer
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *
 *       400:
 *         description: Invalid order status provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid status
 *
 *       404:
 *         description: Order not found for this rider
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order not found
 */


router.put('/order/tracking/:orderId/status', riderAuthentication, trackOrder)

/**
 * @swagger
 * /user/order/tracking/{orderId}:
 *   get:
 *     summary: Get tracking details for a specific user order
 *     description: Retrieves the full tracking status and related vendor and user information for a given order.
 *     tags:
 *       - User Dashboard
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         description: ID of the order to retrieve tracking for
 *         schema:
 *           type: string
 *           example: "b9a72f35-7b52-44b3-9372-d4c4a6c8f730"
 *     responses:
 *       200:
 *         description: Order tracking details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order status fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     orderId:
 *                       type: string
 *                       example: "b9a72f35-7b52-44b3-9372-d4c4a6c8f730"
 *                     orderNumber:
 *                       type: string
 *                       example: "ORD-102938"
 *                     cylinderSize:
 *                       type: string
 *                       example: "12.5kg"
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *                     totalPrice:
 *                       type: number
 *                       example: 12500
 *                     deliveryFee:
 *                       type: number
 *                       example: 1500
 *                     scheduledTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-11-12T10:30:00.000Z"
 *                     currentStatus:
 *                       type: string
 *                       example: "refillingCylinder"
 *                     currentStage:
 *                       type: string
 *                       example: "refillingCylinder"
 *                     trackingStages:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example:
 *                         - navigatingToCustomer
 *                         - pickedUpCylinder
 *                         - navigatingToVendor
 *                         - refillingCylinder
 *                         - returningToCustomer
 *                         - completed
 *                     vendor:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "Gas Point Nigeria"
 *                         address:
 *                           type: string
 *                           example: "23 Industrial Layout, Lekki"
 *                         phone:
 *                           type: string
 *                           example: "09012345678"
 *                     user:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "John Doe"
 *                         address:
 *                           type: string
 *                           example: "12B Ikoyi Crescent, Lagos"
 *                         phone:
 *                           type: string
 *                           example: "08123456789"
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */


router.get('/user/order/tracking/:orderId', authentication, getUserOrderTracking)
module.exports = router
