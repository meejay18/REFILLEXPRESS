const express = require('express')
const { signUp } = require('../controller/userController')

const route = express.Router()

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /api/v1/user:
 *   post:
 *     summary: Create a new user account
 *     tags: [Users]
 *     description: Endpoint for signing up a new user.
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
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Mije
 *               lastName:
 *                 type: string
 *                 example: Digban
 *               email:
 *                 type: string
 *                 example: mdigban@gmail.com
 *               phoneNumber:
 *                 type: string
 *                 example: 09056345749
 *               password:
 *                 type: string
 *                 example: 12345
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 83e3a1fe8d9ab7ff15abac23
 *                     firstName:
 *                       type: string
 *                       example: Mije
 *                     lastName:
 *                       type: string
 *                       example: Digban
 *                     email:
 *                       type: string
 *                       example: mdigban@gmail.com
 *                     phoneNumber:
 *                       type: string
 *                       example: 09056345749
 */
route.post('/user', signUp)

module.exports = route
