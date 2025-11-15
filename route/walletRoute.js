const express = require("express")
const { distributeFunds } = require("../controller/walletController")
const router = express.Router()



router.post("/wallet/:orderId/distributeFunds", distributeFunds )

module.exports = router