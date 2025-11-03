const emailSender = require('../middleware/nodemailer')
const { User } = require('../models')
const { Vendor } = require('../models')
const bcrypt = require('bcryptjs')
const { signUpTemplate, resendOtpTemplate, forgotPasswordTemplate } = require('../utils/emailTemplate')
const jwt = require('jsonwebtoken')

exports.signUp = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phoneNumber, password } = req.body

    const existingUser = await User.findOne({ where: { email: email.trim().toLowerCase() } })
    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists',
      })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    const newUser = await User.create({
      firstName,
      lastName,
      email: email.trim().toLowerCase(),
      phoneNumber,
      password: hashedPassword,
      otp: otp,
      otpExpiredAt: Date.now() + 1000 * 60 * 5,
    })

    const emailOptions = {
      email: newUser.email,
      subject: 'Sign up successful',
      html: signUpTemplate(otp, newUser.firstName),
    }

    await emailSender(emailOptions)

    return res.status(201).json({
      message: 'User created successfully',
      data: {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      },
    })
  } catch (error) {
    next(error)
  }
}

exports.verify = async (req, res, next) => {
  try {
    const { email, otp } = req.body

    const checkUser = await User.findOne({ where: { email: email.toLowerCase() } })
    if (!checkUser) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    if (Date.now() > checkUser.otpExpiredAt) {
      return res.status(400).json({
        message: 'Otp expired, Please request another otp',
      })
    }

    if (otp !== checkUser.otp) {
      return res.status(400).json({
        message: 'Invalid OTP',
      })
    }

    if (checkUser.isVerified) {
      return res.status(400).json({
        message: 'User already verified, Please proceed to login',
      })
    }

    checkUser.isVerified = true
    checkUser.otp = null
    checkUser.otpExpiredAt = null

    await checkUser.save()

    return res.status(200).json({
      message: 'User verified successfully',
      data: {
        id: checkUser.id,
        email: checkUser.email,
        isVerified: checkUser.isVerified,
      },
    })
  } catch (error) {
    next(error)
  }
}
exports.resendOtp = async (req, res, next) => {
  const { email } = req.body
  try {
    const user = await User.findOne({ where: { email: email.toLowerCase() } })
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: 'User already verified',
      })
    }

    const newOtp = Math.round(Math.random() * 1e6)
      .toString()
      .padStart(6, '0')

    user.otp = newOtp
    user.otpExpiredAt = Date.now() + 1000 * 60 * 5

    await user.save()

    const emailOptions = {
      email: user.email,
      subject: 'Sign up successful',
      html: resendOtpTemplate(newOtp, user.firstName),
    }

    await emailSender(emailOptions)

    return res.status(200).json({
      message: 'OTP resent successfully',
      data: {
        email: user.email,
        otpSent: true,
      },
    })
  } catch (error) {
    next(error)
  }
}

// exports.verifyOtp = async (req, res, next) => {
//   const { email, otp } = req.body
//   try {
//     const user = await User.findOne({ where: { email: email?.toLowerCase() } })
//     if (!user) {
//       return res.status(404).json({
//         message: 'User not found',
//       })
//     }

//     if (user.isVerified) {
//       return res.status(400).json({
//         message: 'User already verified',
//       })
//     }

//     if (user.otp !== otp) {
//       return res.status(400).json({
//         message: 'Invalid otp',
//       })
//     }

//     if (Date.now() > user.otpExpiredAt) {
//       return res.status(400).json({
//         message: 'otp expired, please request a new one',
//       })
//     }

//     user.isVerified = true
//     user.otp = null
//     user.otpExpiredAt = null

//     await user.save()

//     return res.status(200).json({
//       email: user.email,
//       message: 'Otp verified successfully',
//     })
//   } catch (error) {
//     next(error)
//   }
// }
exports.verifyForgotPasswordOtp = async (req, res, next) => {
  const { email, otp } = req.body
  try {
    const user = await User.findOne({ where: { email: email?.toLowerCase() } })
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        message: 'Invalid otp',
      })
    }

    if (Date.now() > user.otpExpiredAt) {
      return res.status(400).json({
        message: 'otp expired, please request a new one',
      })
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '2hr' })

    user.otp = null
    user.otpExpiredAt = null

    await user.save()

    return res.status(200).json({
      email: user.email,
      message: 'Otp verified successfully',
      token: token,
    })
  } catch (error) {
    next(error)
  }
}
exports.ForgotPasswordOtpResend = async (req, res, next) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ where: { email: email?.toLowerCase() } })
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    const newOtp = Math.round(Math.random() * 1e6)
      .toString()
      .padStart(6, '0')

    user.otp = newOtp
    user.otpExpiredAt = Date.now() + 1000 * 60 * 5

    await user.save()

    const emailOptions = {
      email: user.email,
      subject: 'Forgot password',
      html: forgotPasswordTemplate(newOtp, user.firstName),
    }

    await emailSender(emailOptions)
    return res.status(200).json({
      message: 'forgot password request sent',
    })
  } catch (error) {
    next()
  }
}
exports.login = async (req, res, next) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({
      where: {
        email: email.toLowerCase(),
      },
    })

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    if (!user.isVerified) {
      return res.status(400).json({
        message: 'User not verified, please verify your account',
      })
    }

    const comparePassword = await bcrypt.compare(password, user.password)
    if (!comparePassword) {
      return res.status(400).json({
        message: 'Incorrect password',
      })
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '2hr',
    })

    return res.status(200).json({
      message: 'Login successfull',
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      token: token,
    })
  } catch (error) {
    next(error)
  }
}
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body

    const user = await User.findOne({
      where: {
        email: email.toLowerCase(),
      },
    })
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    // const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '20m' })

    // // const link = `${req.protocol}://${req.get('host')}/user/reset/password/${token}`
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString()

    user.otp = newOtp
    user.otpExpiredAt = Date.now() + 1000 * 60 * 5

    await user.save()

    const emailOptions = {
      email: user.email,
      subject: 'Reset Password',
      html: forgotPasswordTemplate(newOtp, user.firstName),
    }

    await emailSender(emailOptions)
    return res.status(200).json({
      message: 'forgot password request sent',
    })
  } catch (error) {
    next(error)
  }
}
exports.resetPassword = async (req, res, next) => {
  const { email, newPassword } = req.body

  try {
    if (!email || !newPassword) {
      return res.status(400).json({
        message: 'All fields are required',
      })
    }

    const user = await User.findOne({ where: { email: email.toLowerCase() } })
    if (!user) {
      return res.status(404).json({
        message: 'user not found',
      })
    }

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)

    user.otp = null
    user.otpExpiredAt = null

    await user.save()

    return res.status(200).json({
      message: 'Password reset successfully',
    })
  } catch (error) {
    next(error)
  }
}
exports.changePassword = async (req, res, next) => {
  const { id } = req.user
  const { oldPassword, newPassword, confirmPassword } = req.body
  try {
    const user = await User.findOne({ where: { id } })
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    const checkOldPassword = await bcrypt.compare(oldPassword, user.password)
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

    user.password = hashedPassword
    await user.save()

    return res.status(200).json({
      message: 'Password changed successfully',
    })
  } catch (error) {
    next(error)
  }
}

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll()

    if (users.length === 0) {
      return res.status(400).json({
        message: 'No users found',
        data: [],
      })
    }
    return res.status(200).json({
      message: 'Users retrieved successfully',
      data: users,
    })
  } catch (error) {
    next(error)
  }
}
exports.getOneUser = async (req, res, next) => {
  const { userId } = req.params
  try {
    const user = await User.findByPk(userId)
    if (!user) {
      return res.status(400).json({
        message: 'User not found',
      })
    }

    return res.status(200).json({
      message: 'User retrieved successfully',
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

exports.getUserProfile = async (req, res, next) => {
  const userId = req.user.id

  try {
    const user = await User.findByPk(userId, {
      attributes: ['firstName', 'lastName', 'email'],
    })

    return res.status(200).json({
      message: 'User profile fetched successfully',
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

exports.getNearbyVendors = async (req, res, next) => {
  try {
    const vendors = await Vendor.findAll({
      where: { isAvailable: true },
      attributes: ['businessName', 'pricePerKg', 'openingTime', 'rating', 'businessAddress'],
      order: [['rating', 'DESC']],
    })

    return res.status(200).json({
      message: 'Nearby vendors retrieved successfully',
      data: vendors,
    })
  } catch (error) {
    next(error)
  }
}
