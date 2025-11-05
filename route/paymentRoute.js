const express = require("express")
const { authentication } = require("../middleware/authentication")
const { initializePayment } = require("../controller/paymentController")
const router = express.Router()



router.post("/user/initializePayment/:orderId", authentication, initializePayment)

module.exports = router