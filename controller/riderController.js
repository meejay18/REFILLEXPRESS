const emailSender = require('../middleware/nodemailer')
const { Rider } = require('../models')
// const Rider = db.Rider
const bcrypt = require('bcryptjs')
const {
  riderSignUpTemplate,
  riderResendOtpTemplate,
  riderForgotPasswordTemplate,
} = require('../utils/emailTemplate')
const jwt = require('jsonwebtoken')

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
      message: 'Rider created successfully',
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
      expiresIn: '2hr',
    })

    return res.status(200).json({
      message: 'Login successfull',
      data: {
        id: rider.id,
        firstName: rider.firstName,
        lastName: rider.lastName,
        email: rider.email,
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
