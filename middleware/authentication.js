const jwt = require('jsonwebtoken')
const { User } = require('../models')
const { Vendor } = require('../models')

exports.authentication = async (req, res, next) => {
  try {
    const auth = req.headers.authorization
    if (!auth) {
      return res.status(401).json({
        message: 'Auth missing',
      })
    }

    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token missing or malformed' })
    }

    const token = auth.split(' ')[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findOne({ where: { id: decoded.id } })

    console.log("user:", user);
    

    if (!user) {
      return res.status(404).json({
        message: 'Authentication failed, User not found',
      })
    }

    req.user = decoded
    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        message: ' Session timed out, please login to your account',
      })
    }
    next(error)
  }
}

exports.vendorAuthentication = async (req, res, next) => {
  try {
    const auth = req.headers.authorization
    if (!auth) {
      return res.status(401).json({
        message: 'Auth missing',
      })
    }

    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token missing or malformed' })
    }

    const token = auth.split(' ')[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const vendor = await Vendor.findOne({ where: { id: decoded.id } })
    if (!vendor) {
      return res.status(404).json({
        message: 'Authentication failed, Vendor not found',
      })
    }

    req.vendor = decoded
    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        message: ' Session timed out, please login to your account',
      })
    }
    next(error)
  }
}

exports.adminAuthentication = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized, no user found in request',
      })
    }
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'forbidden, only admins are allowed to carry out this action',
      })
    }
    next()
  } catch (error) {
    next(error)
  }
}


