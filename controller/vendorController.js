const emailSender = require('../middleware/nodemailer')
const { Vendor } = require('../models')
const { Order, Rider } = require('../models')
const { User } = require('../models')
const { VendorKyc } = require('../models')
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')
const cloudinary = require('../config/cloudinary')
const {
  vendorSignUpTemplate,
  resendOtpVendorTemplate,
  forgotPasswordVendorTemplate,
  orderStatusTemplate,
  bulkEmailRiderTemplate,
} = require('../utils/emailTemplate')
const jwt = require('jsonwebtoken')

exports.vendorSignUp = async (req, res, next) => {
  try {
    const {
      businessName,
      businessEmail,
      businessPhoneNumber,
      businessAddress,
      firstName,
      lastName,
      password,
    } = req.body
    const existingVendor = await Vendor.findOne({ where: { businessEmail: businessEmail?.toLowerCase() } })
    console.log('Vendor model check:', Vendor)

    if (existingVendor) {
      return res.status(400).json({
        message: 'Vendor already exists',
      })
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    const newVendor = await Vendor.create({
      businessName,
      businessAddress,
      businessPhoneNumber,
      businessEmail: businessEmail?.toLowerCase(),
      firstName,
      lastName,
      password: hashedPassword,
      otp: otp,
      otpExpiredAt: Date.now() + 1000 * 60 * 5,
    })

    const emailOptions = {
      email: newVendor.businessEmail,
      subject: 'Sign up successfull',
      html: vendorSignUpTemplate(otp, newVendor.businessName),
    }
    await emailSender(emailOptions)

    return res.status(201).json({
      message: 'Vendor created successfully',
      data: {
        firstName: newVendor.firstName,
        lastName: newVendor.lastName,
        businessEmail: newVendor.businessEmail,
      },
    })
  } catch (error) {
    next(error)
  }
}

exports.verifyVendor = async (req, res, next) => {
  try {
    const { businessEmail, otp } = req.body

    const checkVendor = await Vendor.findOne({ where: { businessEmail: businessEmail?.toLowerCase() } })
    if (!checkVendor) {
      return res.status(404).json({
        message: 'Vendor not found',
      })
    }

    if (Date.now() > new Date(checkVendor.otpExpiredAt).getTime()) {
      return res.status(400).json({
        message: 'otp expired, please request a new one',
      })
    }

    if (otp !== checkVendor.otp) {
      return res.status(400).json({
        message: 'Invalid OTP',
      })
    }

    if (checkVendor.isVerified) {
      return res.status(400).json({
        message: 'Vendor already verified, Please proceed to login',
      })
    }

    checkVendor.isVerified = true
    checkVendor.otp = null
    checkVendor.otpExpiredAt = null

    await checkVendor.save()

    return res.status(200).json({
      message: 'Vendor verified successfully',
      data: {
        id: checkVendor.id,
        email: checkVendor.businessEmail,
        isVerified: checkVendor.isVerified,
      },
    })
  } catch (error) {
    next(error)
  }
}

exports.resendVendorOtp = async (req, res, next) => {
  const { businessEmail } = req.body
  try {
    const vendor = await Vendor.findOne({ where: { businessEmail: businessEmail.toLowerCase() } })
    if (!vendor) {
      return res.status(404).json({
        message: 'Vendor not found',
      })
    }

    if (vendor.isVerified) {
      return res.status(400).json({
        message: 'Vendor already verified',
      })
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString()

    vendor.otp = newOtp
    vendor.otpExpiredAt = Date.now() + 1000 * 60 * 5

    await vendor.save()

    const emailOptions = {
      email: vendor.businessEmail,
      subject: 'Sign up successful',
      html: resendOtpVendorTemplate(newOtp, vendor.businessName),
    }

    await emailSender(emailOptions)

    return res.status(200).json({
      message: 'OTP resent successfully',
      data: {
        businessEmail: vendor.businessEmail,
        otpSent: true,
      },
    })
  } catch (error) {
    next(error)
  }
}
exports.verifyVendorOtp = async (req, res, next) => {
  const { businessEmail, otp } = req.body
  try {
    const vendor = await Vendor.findOne({
      where: { businessEmail: businessEmail.toLowerCase() },
    })
    if (!vendor || !otp) {
      return res.status(400).json({
        message: 'Email and OTP required',
      })
    }

    if (!vendor) {
      return res.status(400).json({
        message: 'Vendor not found',
      })
    }
    if (vendor.isVerified) {
      return res.status(400).json({
        message: 'Vendor already verified',
      })
    }
    if (vendor.otp !== otp) {
      return res.status(400).json({
        message: 'Invalid Otp',
      })
    }
    if (!vendor.otpExpiredAt || vendor.otpExpiredAt < Date.now()) {
      return res.status(400).json({ message: 'OTP expired, please request a new one' })
    }
    vendor.isVerified = true
    vendor.otp = null
    vendor.otpExpiredat = true

    await vendor.save()

    return res.status(200).json({
      message: 'OTP verified successfully',
    })
  } catch (error) {
    next(error)
  }
}

exports.Vendorlogin = async (req, res, next) => {
  const { businessEmail, password } = req.body
  try {
    const vendor = await Vendor.findOne({
      where: {
        businessEmail: businessEmail?.toLowerCase(),
      },
    })

    if (!vendor) {
      return res.status(404).json({
        message: 'Vendor not found',
      })
    }

    if (!vendor.isVerified) {
      return res.status(400).json({
        message: 'Vendor not verified, please verify your account',
      })
    }

    const comparePassword = await bcrypt.compare(password, vendor.password)
    if (!comparePassword) {
      return res.status(400).json({
        message: 'Incorrect password',
      })
    }

    const kyc = await VendorKyc.findOne({ where: { vendorId: vendor.id } })

    if (!kyc || vendor.pricePerKg == null || vendor.openingTime === null) {
      vendor.isNewUser = true
    } else {
      vendor.isNewUser = false
    }

    await vendor.save()

    const showKycPage = !kyc || ['not submitted', 'rejected'].includes(kyc.verificationStatus?.toLowerCase())

    const token = jwt.sign({ id: vendor.id, businessEmail: vendor.businessEmail }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    })

    return res.status(200).json({
      message: 'Login successfull',
      data: {
        id: vendor.id,
        firstName: vendor.firstName,
        lastName: vendor.lastName,
        businessEmail: vendor.businessEmail,
        kycStatus: kyc?.verificationStatus || 'Not submiited',
        showKycPage,
        isNewUser: vendor.isNewUser,
      },
      token: token,
    })
  } catch (error) {
    next(error)
  }
}

exports.vendorForgotPassword = async (req, res, next) => {
  try {
    const { businessEmail } = req.body

    const vendor = await Vendor.findOne({
      where: {
        businessEmail: businessEmail.toLowerCase(),
      },
    })
    if (!vendor) {
      return res.status(404).json({
        message: 'Vendor not found',
      })
    }

    // const token = jwt.sign({ id: vendor.id, businessEmail: vendor.businessEmail }, process.env.JWT_SECRET, {
    //   expiresIn: '20m',
    // })

    // const link = `${req.protocol}://${req.get('host')}/user/reset/password/${token}`

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString()
    const emailOptions = {
      email: vendor.businessEmail,
      subject: 'Reset password',
      html: forgotPasswordVendorTemplate(newOtp, vendor.firstName),
    }

    vendor.otp = newOtp
    vendor.otpExpiredAt = Date.now() + 1000 * 60 * 5

    await emailSender(emailOptions)

    await vendor.save()
    return res.status(200).json({
      message: 'forgot password request sent',
    })
  } catch (error) {
    next(error)
  }
}

exports.verifyVendorForgotPasswordOtp = async (req, res, next) => {
  const { businessEmail, otp } = req.body
  try {
    const vendor = await Vendor.findOne({
      where: { businessEmail: businessEmail?.toLowerCase() },
    })
    console.log(vendor)

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' })
    }

    if (vendor.otp !== otp) {
      return res.status(400).json({ message: 'Invalid otp' })
    }

    if (Date.now() > new Date(vendor.otpExpiredAt).getTime()) {
      return res.status(400).json({
        message: 'otp expired, please request a new one',
      })
    }

    const token = jwt.sign({ id: vendor.id, businessEmail: vendor.businessEmail }, process.env.JWT_SECRET, {
      expiresIn: '20m',
    })

    vendor.otp = null
    vendor.otpExpiredAt = null

    await vendor.save()

    return res.status(200).json({
      email: vendor.businessEmail,
      message: 'Otp verified successfully',
      token,
    })
  } catch (error) {
    next(error)
  }
}

exports.vendorResetPassword = async (req, res, next) => {
  const { businessEmail, newPassword } = req.body

  try {
    if (!businessEmail || !newPassword) {
      return res.status(400).json({
        message: 'All fields are required',
      })
    }

    const vendor = await Vendor.findOne({ where: { businessEmail: businessEmail.toLowerCase() } })
    if (!vendor) {
      return res.status(404).json({
        message: 'Vendor not found',
      })
    }

    const salt = await bcrypt.genSalt(10)
    vendor.password = await bcrypt.hash(newPassword, salt)

    vendor.otp = null
    vendor.otpExpiredAt = null

    await vendor.save()

    return res.status(200).json({
      message: 'Password reset successfully',
    })
  } catch (error) {
    next(error)
  }
}

exports.vendorForgotPasswordOtpResend = async (req, res, next) => {
  try {
    const { businessEmail } = req.body

    const vendor = await Vendor.findOne({ where: { businessEmail: businessEmail?.toLowerCase() } })
    if (!vendor) {
      return res.status(404).json({
        message: 'Vendor not found',
      })
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString()

    vendor.otp = newOtp
    vendor.otpExpiredAt = Date.now() + 1000 * 60 * 5

    await vendor.save()

    const emailOptions = {
      email: vendor.businessEmail,
      subject: 'Forgot password',
      html: forgotPasswordVendorTemplate(newOtp, vendor.firstName),
    }

    await emailSender(emailOptions)
    return res.status(200).json({
      message: 'forgot password request sent',
    })
  } catch (error) {
    next()
  }
}
exports.changeVendorPassword = async (req, res, next) => {
  const { id } = req.vendor
  const { oldPassword, newPassword, confirmPassword } = req.body
  try {
    const vendor = await Vendor.findOne({ where: { id } })
    if (!vendor) {
      return res.status(404).json({
        message: '  Vendor not found',
      })
    }

    const checkOldPassword = await bcrypt.compare(oldPassword, vendor.password)
    if (!checkOldPassword) {
      return res.status(400).json({
        message: 'old Password incorrect',
      })
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: 'new password incorrect',
      })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    vendor.password = hashedPassword
    await vendor.save()

    return res.status(200).json({
      message: 'Password changed successfully',
    })
  } catch (error) {
    next(error)
  }
}

exports.getAllvendors = async (req, res, next) => {
  try {
    const vendors = await Vendor.findAll({
      order: [['createdAt', 'DESC']]
    })

    if (vendors.length === 0) {
      return res.status(400).json({
        message: 'No vendors found',
        data: [],
      })
    }

    return res.status(200).json({
      message: 'Vendors retrieved successfully',
      data: vendors,
    })
  } catch (error) {
    next(error)
  }
}

exports.getOneVendor = async (req, res, next) => {
  const { vendorId } = req.params
  try {
    const vendor = await Vendor.findByPk(vendorId)
    if (!vendor) {
      return res.status(404).json({
        message: 'Vendor not foound',
      })
    }

    return res.status(200).json({
      message: 'Vendor retrieved successfully',
      data: vendor,
    })
  } catch (error) {
    next(error)
  }
}

exports.vendorDashboardSummary = async (req, res, next) => {
  const vendorId = req.vendor.id
  try {
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)

    const todayOrders = await Order.count({
      where: {
        vendorId,
        createdAt: {
          [Op.between]: [todayStart, todayEnd],
        },
      },
    })

    const pendingOrders = await Order.count({
      where: {
        vendorId,
        status: 'pending',
      },
    })

    const completedToday = await Order.count({
      where: {
        vendorId,
        status: 'completed',
        updatedAt: {
          [Op.between]: [todayStart, todayEnd],
        },
      },
    })

    const todayRevenue = await Order.sum('price', {
      where: {
        vendorId,
        status: 'completed',
        updatedAt: {
          [Op.between]: [todayStart, todayEnd],
        },
      },
    })

    return res.status(200).json({
      message: 'Dashboard updated successfully',
      data: {
        todayOrders,
        pendingOrders,
        completedToday,
        todayRevenue: todayRevenue || 0,
      },
    })
  } catch (error) {
    next(error)
  }
}

exports.getPendingOrders = async (req, res, next) => {
  const vendorId = req.vendor.id

  try {
    const pendingOrders = await Order.findAll({
      where: {
        vendorId,
        status: 'pending',
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'phoneNumber'],
        },
      ],

      order: [['createdAt', 'DESC']],
    })

    return res.status(200).json({
      message: 'pending orders retrieved',
      data: pendingOrders,
    })
  } catch (error) {
    next(error)
  }
}

exports.acceptOrRejectOrder = async (req, res, next) => {
  const vendorId = req.vendor.id
  const { orderId } = req.params
  const { action, message } = req.body

  try {
    const validActions = {
      accept: 'active',
      reject: 'cancelled',
    }

    const actionMessages = {
      accept: 'Order accepted successfully',
      reject: 'Order rejected successfully',
    }

    if (!validActions[action]) {
      return res.status(400).json({
        message: 'Invalid action',
      })
    }

    const order = await Order.findOne({
      where: { id: orderId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'phoneNumber', 'email', 'residentialAddress'],
        },
        {
          model: Vendor,
          as: 'vendor',
          attributes: ['businessName', 'phoneNumber'],
        },
      ],
    })

    console.log('orderId:', orderId)
    console.log('vendorId:', vendorId)

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      })
    }

    if (order.vendorId && order.vendorId !== vendorId) {
      return res.status(403).json({
        message: 'This order belongs to another vendor',
      })
    }
    if (!order.vendorId) {
      order.vendorId = vendorId
      await order.save()
    }
    if (order.status !== 'pending') {
      return res.status(403).json({
        message: 'Order is not pending',
      })
    }

    const updatePayload = { status: validActions[action] }

    if (action === 'reject' && message) {
      updatePayload.rejectionMessage = message
    }

    await order.update(updatePayload)

    const emailOptions = {
      email: order.user.email,
      subject: 'Order Confirmation Mail',
      html: orderStatusTemplate(
        action,
        order.user.firstName,
        order.orderNumber,
        order.quantity,
        order.totalPrice,
        message
      ),
    }

    await emailSender(emailOptions)

    const riders = await Rider.findAll({
      where: {
        status: 'active',
      },
    })

    for (const rider of riders) {
      try {
        const riderOptions = {
          email: rider.email,
          subject: 'Order Notification',
          html: bulkEmailRiderTemplate(
            rider.firstName,
            order.orderNumber,
            order.vendor.businessName,
            order.user.residentialAddress,
            order.quantity,
            order.cylinderSize
          ),
        }
        await emailSender(riderOptions)
        console.log('bulk email sent', rider.email)
      } catch (error) {
        console.log(error.message)
      }
    }

    return res.status(200).json({
      message: actionMessages[action],
      data: order,
    })
  } catch (error) {
    next(error)
  }
}

exports.updateVendorSettingsField = async (req, res, next) => {
  const { pricePerKg, minimumOrder, openingTime, closingTime, businessAvailability, inStock } = req.body

  const vendorId = req.vendor.id
  try {
    const vendor = await Vendor.findByPk(vendorId)

    if (!vendorId) {
      return res.status(404).json({
        message: 'Vendor not found',
      })
    }

    await vendor.update({
      pricePerKg,
      minimumOrder,
      openingTime,
      closingTime,
      businessAvailability,
      inStock,
    })

    return res.status(200).json({
      message: 'Vendor updated successfully',
      data: vendor,
    })
  } catch (error) {
    next(error)
  }
}

exports.updateVendorAccount = async (req, res, next) => {
  const vendorId = req.vendor.id
  const { businessPhoneNumber, phoneNumber, fullName, businessName, businessAddress, residentialAddress } =
    req.body

  const file = req.file
  try {
    const vendor = await Vendor.findByPk(vendorId)
    if (!vendor) {
      return res.status(404).json({
        message: 'Vendor not found',
      })
    }
    if (vendor.id !== vendorId) {
      return res.status(400).json({
        message: 'This account does not belong to you',
      })
    }

    let vendorImage = vendor.vendorImage
    // console.log(vendor)

    if (file) {
      const resource = await cloudinary.uploader.upload(file.path)
      vendorImage = resource.secure_url
    }

    const updatedAccount = await vendor.update({
      vendorImage,
      businessPhoneNumber,
      phoneNumber,
      fullName,
      businessName,
      businessAddress,
      residentialAddress,
    })

    return res.status(200).json({
      message: 'Vendor updated successfully',
      data: updatedAccount,
    })
  } catch (error) {
    next(error)
  }
}
