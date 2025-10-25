const express = require('express')
require('./models')
const app = express()
const cors = require("cors")
app.use(cors("*"))
app.use(express.json())

const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const PORT = 3500

const userRouter = require('./route/userRoute')
app.use('/api/v1', userRouter)
const vendorRouter = require ('./route/vendorRoute')
app.use('/api/v1', vendorRouter)

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
      url: 'http://localhost:3500',
      description: 'Development server',
    },
    {
      url: 'http://localhost:3000',
      description: 'Production server',
    },
  ],
  tags: [
    {
      name: 'User',
      description: 'Endpoints for user authentication, verification, and password management',
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
