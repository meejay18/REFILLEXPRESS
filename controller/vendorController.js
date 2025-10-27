const emailSender = require('../middleware/nodemailer')
const { Vendor } = require('../models')
const { Order } = require('../models')
const bcrypt = require('bcryptjs')
const { signUpTemplate, resendOtpTemplate, forgotPasswordTemplate } = require('../utils/emailTemplate')
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

    const otp = Math.round(Math.random() * 1e6)
      .toString()
      .padStart(6, '0')

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
      html: signUpTemplate(otp, newVendor.businessName),
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

    if (Date.now() > checkVendor.otpExpiredAt) {
      return res.status(400).json({
        message: 'Otp expired, Please request another otp',
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

    const newOtp = Math.round(Math.random() * 1e6)
      .toString()
      .padStart(6, '0')

    vendor.otp = newOtp
    vendor.otpExpiredAt = Date.now() + 1000 * 60 * 5

    await vendor.save()

    const emailOptions = {
      email: vendor.businessEmail,
      subject: 'Sign up successful',
      html: resendOtpTemplate(newOtp, vendor.businessName),
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

    const token = jwt.sign({ id: vendor.id, businessEmail: vendor.businessEmail }, process.env.JWT_SECRET, {
      expiresIn: '2hr',
    })

    return res.status(200).json({
      message: 'Login successfull',
      data: {
        id: vendor.id,
        firstName: vendor.firstName,
        lastName: vendor.lastName,
        businessEmail: vendor.businessEmail,
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

    const token = jwt.sign({ id: vendor.id, businessEmail: vendor.businessEmail }, process.env.JWT_SECRET, {
      expiresIn: '20m',
    })

    const link = `${req.protocol}://${req.get('host')}/user/reset/password/${token}`

    const emailOptions = {
      email: vendor.businessEmail,
      subject: 'Reset password',
      html: forgotPasswordTemplate(link, vendor.firstName),
    }

    await emailSender(emailOptions)
    return res.status(200).json({
      message: 'forgot password request sent',
    })
  } catch (error) {
    next(error)
  }
}
exports.vendorResetPassword = async (req, res, next) => {
  const { token } = req.params
  const { newPassword, confirmPassword } = req.body
  try {
    if (!newPassword && !confirmPassword) {
      return res.status(400).json({
        message: 'please provide both passwords',
      })
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: 'Passwords do not match',
      })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const vendor = await Vendor.findOne({ where: { id: decoded.id } })
    if (!vendor) {
      return res.status(404).json({
        message: 'Vendor not found',
      })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    vendor.password = hashedPassword

    const tokenExpiry = Date.now() + 1000 * 60 * 5

    if (Date.now() > tokenExpiry) {
      return res.status(400).json({
        message: 'Password expired, resend a password',
      })
    }

    vendor.resetPasswordExpiredAt = tokenExpiry

    await vendor.save()

    return res.status(200).json({
      message: 'Password reset successfully',
    })
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Reset link has expired' })
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: 'Invalid or malformed token' })
    }
    next(error)
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
    const vendors = await Vendor.findAll()

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

// {
//       include: [
//         {
//           model: Order,
//           as: 'orders',
//         },
//       ],
//     }
