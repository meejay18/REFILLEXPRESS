const emailSender = require('../middleware/nodemailer')
const { User } = require('../models')
const bcrypt = require('bcryptjs')
const { signUpTemplate, resendOtpTemplate, forgotPasswordTemplate } = require('../utils/emailTemplate')
const jwt = require('jsonwebtoken')

exports.signUp = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phoneNumber, password } = req.body

    const existingUser = await User.findOne({ where: { email: email.toLowerCase() } })
    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists',
      })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const otp = Math.round(Math.random() * 1e6)
      .toString()
      .padStart(6, '0')

    const newUser = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      phoneNumber,
      password: hashedPassword,
      otp: otp,
      otpExpiredAt: Date.now() + 1000 * 60 * 5,
    })

    const emailOptions = {
      to: newUser.email,
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

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '20m' })

    const link = `${req.protocol}://${req.get('host')}/user/reset/password/${token}`

    const emailOptions = {
      email: user.email,
      subject: 'Reset password',
      html: forgotPasswordTemplate(link, user.firstName),
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

    const user = await User.findOne({ where: { id: decoded.id } })
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    user.password = hashedPassword

    const tokenExpiry = Date.now() + 1000 * 60 * 5

    if (Date.now() > tokenExpiry) {
      return res.status(400).json({
        message: 'Password expired, resend a password',
      })
    }

    user.resetPasswordExpiredAt = tokenExpiry

    await user.save()

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
exports.changePassword = async (req, res, next) => {
  const { id } = req.user
  const { oldPassword, newPassword, confirmPassword } = req.body
  try {
    const user = await User.findOne({ where: { id } })
    if(!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }


    const checkOldPassword = await bcrypt.compare(oldPassword, user.password)
    if(!checkOldPassword) {
      return res.status(400).json({
        message: "old Password incorrect"
      })
    }

    if(newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "new password incorrect"
      })
    }


    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    user.password = hashedPassword
    await user.save()

    return res.status(200).json({
        message: "Password changed successfully"
      })
  } catch (error) {
    next(error)
  }
}
