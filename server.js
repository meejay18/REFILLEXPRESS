const express = require('express')
require('dotenv').config()
const sequelize = require('./database/database')
const PORT = 3500
const app = express()
const cors = require('cors')
app.use(cors('*'))
app.use(express.json())
const morgan = require('morgan')
app.use(morgan('dev'))

const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const userRouter = require('./route/userRoute')
app.use('/api/v1', userRouter)
const vendorRouter = require('./route/vendorRoute')
app.use('/api/v1', vendorRouter)
const vendorKycRouter = require('./route/vendorKycRoute')
app.use('/api/v1', vendorKycRouter)
const orderRouter = require('./route/orderRoute')
app.use('/api/v1', orderRouter)
const adminRouter = require('./route/adminRoute')
app.use('/api/v1', adminRouter)

const riderRouter = require('./route/riderRoute')
app.use('/api/v1', riderRouter)

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Refill Express API Documentation',
    version: '1.0.0',
    description: 'API documentation for Refill Express — vendor, user, order, and admin services.',
    contact: {
      name: 'Refill Express Team',
      url: 'https://google.com',
    },
  },
  servers: [
    { url: 'https://refillexpress.onrender.com/api/v1', description: 'Production server' },
    { url: 'http://localhost:3500', description: 'Development server' },
  ],
  tags: [
    {
      name: 'User',
      description: 'Endpoints for user registration, login, verification, and account management.',
    },
    {
      name: 'Vendor',
      description: 'Endpoints for vendor management (CRUD operations)',
    },
    {
      name: 'Rider',
      description: 'Endpoints for rider management (SignUp)',
    },
    {
      name: 'Order',
      description: 'Endpoints for placing, managing, and viewing orders.',
    },
    {
      name: 'Admin',
      description: 'Endpoints for administrative actions and dashboard management.',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [{ bearerAuth: [] }],
}

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./route/*.js'],
}

const swaggerSpec = swaggerJSDoc(options)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use((error, req, res, next) => {
  console.error(error)

  if (error.name === 'SequelizeValidationError') {
    const messages = error.errors.map((err) => err.message)
    return res.status(400).json({ message: messages[0] })
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ message: 'Email already exists' })
  }

  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Session expired, please log in again' })
  }

  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File too large. Max 5MB allowed.' })
  }

  return res.status(error.status || 500).json({
    message: error.message || 'An unexpected error occurred',
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})
