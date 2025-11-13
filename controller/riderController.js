const emailSender = require('../middleware/nodemailer')
const { Rider, Order, RiderKyc, Vendor } = require('../models')
const bcrypt = require('bcryptjs')
const { Op, where } = require('sequelize')
const cloudinary = require('../config/cloudinary')

const {
  riderSignUpTemplate,
  riderResendOtpTemplate,
  riderForgotPasswordTemplate,
} = require('../utils/emailTemplate')
const jwt = require('jsonwebtoken')
const { status } = require('init')

exports.RiderSignUp = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phoneNumber, password, operatingArea } = req.body

    console.log('this is rider', Rider)

    const existingRider = await Rider.findOne({ where: { email } })
    console.log('Rider model check:', Rider)

    if (existingRider) {
      return res.status(400).json({
        message: 'Rider already exists',
      })
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const otp = Math.round(Math.random() * 1e6)
      .toString()
      .padStart(6, '0')

    const newRider = await Rider.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
      operatingArea,
      otp: otp,
      otpExpiredAt: Date.now() + 1000 * 60 * 5,
    })

    const emailOptions = {
      email: newRider.email,
      subject: 'Sign up successfull',
      html: riderSignUpTemplate(otp, newRider.firstName),
    }
    await emailSender(emailOptions)

    return res.status(201).json({
      message: 'Rider created successfully, check your mail for an otp to verify your account',
      data: {
        firstName: newRider.firstName,
        lastName: newRider.lastName,
        email: newRider.email,
      },
    })
  } catch (error) {
    next(error)
  }
}

exports.verifyRider = async (req, res, next) => {
  try {
    const { email, otp } = req.body

    const checkRider = await Rider.findOne({ where: { email: email?.toLowerCase() } })
    if (!checkRider) {
      return res.status(404).json({
        message: 'Rider not found',
      })
    }

    if (Date.now() > checkRider.otpExpiredAt) {
      return res.status(400).json({
        message: 'Otp expired, Please request another otp',
      })
    }

    if (otp !== checkRider.otp) {
      return res.status(400).json({
        message: 'Invalid OTP',
      })
    }

    if (checkRider.isVerified) {
      return res.status(400).json({
        message: 'Rider already verified, Please proceed to login',
      })
    }

    checkRider.isVerified = true
    checkRider.otp = null
    checkRider.otpExpiredAt = null

    await checkRider.save()

    return res.status(200).json({
      message: 'Rider verified successfully',
      data: {
        id: checkRider.id,
        email: checkRider.emailAddress,
        isVerified: checkRider.isVerified,
      },
    })
  } catch (error) {
    next(error)
  }
}

exports.resendRiderOtp = async (req, res, next) => {
  const { email } = req.body
  try {
    const rider = await Rider.findOne({ where: { email: email.toLowerCase() } })
    if (!rider) {
      return res.status(404).json({
        message: 'Rider not found',
      })
    }

    if (rider.isVerified) {
      return res.status(400).json({
        message: 'Rider already verified',
      })
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString()

    rider.otp = newOtp
    rider.otpExpiredAt = Date.now() + 1000 * 60 * 5

    await rider.save()

    const emailOptions = {
      email: rider.email,
      subject: 'New One time password',
      html: riderResendOtpTemplate(newOtp, rider.firstName),
    }

    await emailSender(emailOptions)

    return res.status(200).json({
      message: 'OTP resent successfully',
      data: {
        email: rider.email,
        otpSent: true,
      },
    })
  } catch (error) {
    next(error)
  }
}

exports.riderForgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body

    const rider = await Rider.findOne({
      where: {
        email: email.toLowerCase(),
      },
    })
    if (!rider) {
      return res.status(404).json({
        message: 'Rider not found',
      })
    }

    // const token = jwt.sign({ id: rider.id, businessEmail: rider.businessEmail }, process.env.JWT_SECRET, {
    //   expiresIn: '20m',
    // })

    // const link = `${req.protocol}://${req.get('host')}/user/reset/password/${token}`

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString()

    rider.otp = newOtp
    rider.otpExpiredAt = Date.now() + 1000 * 60 * 5

    await rider.save()

    const emailOptions = {
      email: rider.email,
      subject: 'Reset password',
      html: riderForgotPasswordTemplate(newOtp, rider.firstName),
    }

    await emailSender(emailOptions)
    return res.status(200).json({
      message: 'forgot password request sent',
    })
  } catch (error) {
    next(error)
  }
}

exports.riderlogin = async (req, res, next) => {
  const { email, password } = req.body
  try {
    const rider = await Rider.findOne({
      where: {
        email: email?.toLowerCase(),
      },
    })

    if (!rider) {
      return res.status(404).json({
        message: 'Rider not found',
      })
    }

    if (!rider.isVerified) {
      return res.status(400).json({
        message: 'Rider not verified, please verify your account',
      })
    }

    const comparePassword = await bcrypt.compare(password, rider.password)
    if (!comparePassword) {
      return res.status(400).json({
        message: 'Incorrect password',
      })
    }

    const token = jwt.sign({ id: rider.id, email: rider.email }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    })

    return res.status(200).json({
      message: 'Login successfull',
      data: {
        id: rider.id,
        firstName: rider.firstName,
        lastName: rider.lastName,
        email: rider.email,
        kycStatus: rider.kycVerificationStatus,
      },
      token: token,
    })
  } catch (error) {
    next(error)
  }
}

exports.verifyRiderForgotPasswordOtp = async (req, res, next) => {
  const { email, otp } = req.body
  try {
    const rider = await Rider.findOne({ where: { email: email?.toLowerCase() } })
    if (!rider) {
      return res.status(404).json({
        message: 'rider not found',
      })
    }

    if (rider.otp !== otp) {
      return res.status(400).json({
        message: 'Invalid otp',
      })
    }

    if (Date.now() > rider.otpExpiredAt) {
      return res.status(400).json({
        message: 'otp expired, please request a new one',
      })
    }

    const token = jwt.sign({ id: rider.id, email: rider.email }, process.env.JWT_SECRET, { expiresIn: '2hr' })

    rider.otp = null
    rider.otpExpiredAt = null

    await rider.save()

    return res.status(200).json({
      email: rider.email,
      message: 'Otp verified successfully',
      token: token,
    })
  } catch (error) {
    next(error)
  }
}

exports.resetRiderPassword = async (req, res, next) => {
  const { email, newPassword } = req.body

  try {
    if (!email || !newPassword) {
      return res.status(400).json({
        message: 'All fields are required',
      })
    }

    const rider = await Rider.findOne({ where: { email: email.toLowerCase() } })
    if (!rider) {
      return res.status(404).json({
        message: 'rider not found',
      })
    }

    const salt = await bcrypt.genSalt(10)
    rider.password = await bcrypt.hash(newPassword, salt)

    rider.otp = null
    rider.otpExpiredAt = null

    await rider.save()

    return res.status(200).json({
      message: 'Password reset successfully',
    })
  } catch (error) {
    next(error)
  }
}

exports.changeRiderPassword = async (req, res, next) => {
  const { id } = req.rider
  console.log(id)

  const { oldPassword, newPassword, confirmPassword } = req.body
  try {
    const rider = await Rider.findOne({ where: { id } })
    if (!rider) {
      return res.status(404).json({
        message: 'rider not found',
      })
    }

    const checkOldPassword = await bcrypt.compare(oldPassword, rider.password)
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

    rider.password = hashedPassword
    await rider.save()

    return res.status(200).json({
      message: 'Password changed successfully',
    })
  } catch (error) {
    next(error)
  }
}

exports.getRiderDashboard = async (req, res, next) => {
  const { riderId } = req.params
  try {
    const rider = await Rider.findOne({ where: { id: riderId } })
    if (!rider) {
      return res.status(404).json({
        message: 'Rider not found',
      })
    }
    return res.status(200).json({
      message: 'Rider dashboard fetched successfully',
      data: {
        firstName: rider.firstName,
        lastName: rider.lastName,
        email: rider.email,
        phoneNumber: rider.phoneNumber,
        operatingArea: rider.operatingArea,
        earnings: rider.earnings,
        status: rider.status,
        rating: rider.rating,
        refills: rider.refills,
        kycStatus: rider.kycVerificationStatus,
      },
    })
  } catch (error) {
    next(error)
  }
}

exports.getAvailableRefills = async (req, res, next) => {
  try {
    const refills = await Order.findAll({
      where: { status: 'pending', riderId: null },
      order: [['createdAt', 'DESC']],
    })
    res.status(200).json({ message: 'pending refills', data: refills })
  } catch (err) {
    next(err)
  }
}

exports.getRecentRefills = async (req, res, next) => {
  try {
    const riderId = req.rider?.id
    const refills = await Order.findAll({
      where: { status: 'completed', riderId },
      order: [['createdAt', 'DESC']],
      limit: 10,
    })
    res.status(200).json({ message: 'Recent refills', data: refills })
  } catch (error) {
    next(error)
  }
}

exports.getTotalEarnings = async (req, res, next) => {
  try {
    const riderId = req.rider?.id

    const orders = await Order.findAll({
      where: { riderId, status: 'completed' },
      attributes: ['totalPrice'],
    })

    const totalEarnings = orders.reduce((sum, order) => sum + order.totalPrice * 0.05, 0)

    res.status(200).json({
      message: 'Total earnings calculated successfully',
      totalEarnings,
    })
  } catch (error) {
    next(error)
  }
}

exports.getTodaysEarnings = async (req, res, next) => {
  try {
    const riderId = req.rider.id
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const { Op } = require('sequelize')

    const orders = await Order.findAll({
      where: {
        riderId,
        status: 'completed',
        createdAt: { [Op.gte]: today },
      },
      attributes: ['totalPrice'],
    })

    const earnings = orders.reduce((sum, order) => sum + order.totalPrice * 0.05, 0)

    res.status(200).json({
      message: "Today's earnings",
      earnings,
    })
  } catch (error) {
    next(error)
  }
}

exports.getActiveAndCompletedOrders = async (req, res, next) => {
  try {
    const riderId = req.rider?.id
    if (!riderId) {
      return res.status(400).json({ success: false, message: 'Rider ID missing' })
    }

    const orders = await Order.findAll({
      where: {
        riderId,
        status: {
          [Op.in]: ['active', 'completed'],
        },
        paymentStatus: 'paid',
      },
      include: [
        {
          model: Vendor,
          as: 'vendor',
          attributes: ['businessName', 'phoneNumber', 'businessAddress'],
        },
      ],
      order: [['createdAt', 'DESC']],
    })

    const availableOrders = await Order.findAll({
      where: {
        riderId: null,
        status: 'active',
        paymentStatus: 'paid',
      },
      include: [
        {
          model: Vendor,
          as: 'vendor',
          attributes: ['businessName', 'phoneNumber', 'businessAddress'],
        },
      ],
    })

    const activeOrders = orders.filter((order) => order.status === 'active')
    const completedOrders = orders.filter((order) => order.status === 'completed')

    res.status(200).json({
      success: true,
      data: {
        active: activeOrders,
        completed: completedOrders,
        available: availableOrders,
      },
    })
  } catch (error) {
    next(error)
  }
}

exports.updateRiderAccount = async (req, res, next) => {
  const files = req.files
  const { riderId } = req.params
  const { residentialAddress, fullName, phoneNumber, accountName, accountNumber, bankName } = req.body
  try {
    const rider = await Rider.findByPk(riderId)
    if (!rider) {
      return res.status(404).json({
        message: 'Rider doe not exist',
      })
    }

    const resource = await cloudinary.uploader.upload()
  } catch (error) {
    next(error)
  }
}
