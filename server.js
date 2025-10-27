const express = require('express')
require('./models')
const app = express()
const cors = require('cors')
app.use(cors('*'))
app.use(express.json())
const morgan = require("morgan")

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
app.use(morgan("dev"))
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API documentation for our Final project',
    version: '1.0.0',
    description: 'Refill express Swagger Documentation',
    // license: {
    //   name: 'Licensed Under MIT',
    //   url: 'https://spdx.org/licenses/MIT.html',
    // },
    contact: {
      name: 'JSONPlaceholder',
      url: 'https://google.com',
    },
  },
  servers: [
    {
      url: 'https://refillexpress.onrender.com/api/v1',
      description: 'Production server',
    },
    {
      url: 'http://localhost:3500/api/v1',
      description: 'Development server',
    },
  ],
  tags: [
    {
      name: 'User',
      description: 'Endpoints for user authentication, verification, and password management',
    },
    {
      name: 'Vendor',
      description: 'Endpoints for vendor management (CRUD operations)',
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

  security: [
    {
      bearerAuth: [],
    },
  ],
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
