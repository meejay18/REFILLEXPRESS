const express = require('express')
require('./models')
const app = express()
const cors = require('cors')
app.use(cors('*'))
app.use(express.json())
const morgan = require('morgan')
app.use(morgan('dev'))

const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const PORT = 3500

const userRouter = require('./route/userRoute')
app.use('/api/v1', userRouter)
const vendorRouter = require('./route/vendorRoute')
app.use('/api/v1', vendorRouter)
const orderRouter = require('./route/orderRoute')
app.use('/api/v1', orderRouter)
const adminRouter = require('./route/adminRoute')
app.use('/api/v1', adminRouter)

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
    { url: 'http://localhost:3500/api/v1', description: 'Development server' },
  ],
  tags: [
    {
      name: 'User',
      description: 'Endpoints for user registration, login, verification, and account management.',
    },
    {
      name: 'Vendor',
      description: 'Endpoints for vendor registration, authentication, password recovery, and profile management.',
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
  return res.status(error.status || 500).json(error.message || 'An error occurred')
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
