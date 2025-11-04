const { Payment } = require('../models')

const API_KEY = process.env.KORAPAY_SECRET_KEY

exports.initializePayment = async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
}
