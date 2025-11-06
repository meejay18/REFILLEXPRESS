const express = require('express')
const { authentication } = require('../middleware/authentication')
const { initializePayment, verifyPayment } = require('../controller/paymentController')
const router = express.Router()

/**
 * @swagger
 * /user/initializePayment/{orderId}:
 *   post:
 *     summary: Initialize a payment for a user's order
 *     description: Initializes a Korapay payment session for an authenticated user's order using the order ID.
 *     tags:
 *       - Payment
 *     security:
 *       - bearerAuth: []   # JWT authentication required
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *           example: "64c84f23-ed8a-4971-b5b4-b3ac9a01950c"
 *         description: Unique ID of the order to initialize payment for.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example: {}
 *     responses:
 *       201:
 *         description: Payment initialized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: payment initialized successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     reference:
 *                       type: string
 *                       example: REF-1730045678910-320
 *                     checkoutUrl:
 *                       type: string
 *                       example: https://checkout.korapay.com/pay/7x2wef23dhsd
 *       400:
 *         description: Invalid order amount or order already paid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid order amount
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
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
 *       422:
 *         description: Payment initialization failed due to invalid data or Korapay API validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Request failed with status code 422
 *       500:
 *         description: Internal server error
 */

router.post('/user/initializePayment/:orderId', authentication, initializePayment)

router.post('/payment/verify', verifyPayment)

// router.get("/payment/verify", authentication,  verifyPayment)

module.exports = router
