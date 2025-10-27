const express = require('express')
const { placeOrder } = require('../controller/orderController')
const { authentication } = require('../middleware/authentication')
const router = express.Router()

router.post('/order/create-order', authentication, placeOrder)

module.exports = router
