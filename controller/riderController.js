const emailSender = require('../middleware/nodemailer')
const  {Rider} = require('../models')
// const Rider = db.Rider
const bcrypt = require('bcryptjs')
const { signUpTemplate } = require('../utils/emailTemplate')
const {forgotPasswordTemplate} = require('../utils/emailTemplate')
const jwt = require('jsonwebtoken')
// const rider = require('../models/rider')

exports.RiderSignUp = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
       emailAddress,
       phoneNumber,
      password,
     operatingArea
    } = req.body

    // console.log('this is rider', Rider);
    
    const existingRider = await Rider.findOne({ where: { emailAddress } })
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
       emailAddress,
        phoneNumber,
      password: hashedPassword,
       operatingArea,
      otp: otp,
       otpExpiredAt: Date.now() + 1000 * 60 * 5,
    })

    const emailOptions = {
      email: newRider.emailAddress,
      subject: 'Sign up successfull',
      html: signUpTemplate(otp, newRider.firstName),
    }
    await emailSender(emailOptions)

    return res.status(201).json({
      message: 'Rider created successfully',
      data: {
        firstName: newRider.firstName,
        lastName: newRider.lastName,
      email: newRider.emailAddress,
     newRider
      },
    })
  } catch (error) {
    next(error)
  }
}

exports.verifyRider = async (req, res, next) => {
  try {
    const { emailAddress, otp } = req.body

    const checkRider = await Rider.findOne({ where: { emailAddress: emailAddress?.toLowerCase() } })
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
  const { emailAddress } = req.body
  try {
    const rider = await Rider.findOne({ where: { emailAddress: emailAddress.toLowerCase() } })
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

    const newOtp = Math.round(Math.random() * 1e6)
      .toString()
      .padStart(6, '0')

   rider.otp = newOtp
   rider.otpExpiredAt = Date.now() + 1000 * 60 * 5

    await rider.save()

    const emailOptions = {
      emailAddress: rider.emailAddress,
      subject: 'Sign up successful',
      html: resendOtpTemplate(newOtp, rider.firstName),
    }

    await emailSender(emailOptions)

    return res.status(200).json({
      message: 'OTP resent successfully',
      data: {
        emailAddress: rider.emailAddress,
        otpSent: true,
      },
    })
  } catch (error) {
    next(error)
  }
}

exports.Riderlogin = async (req, res, next) => {
  const { emailAddress, password } = req.body
  try {
    const rider = await Rider.findOne({
      where: {
        emailAddress: emailAddress?.toLowerCase(),
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

    const token = jwt.sign({ id: rider.id, emailAddress: rider.emailAddress }, process.env.JWT_SECRET, {
      expiresIn: '2hr',
    })

    return res.status(200).json({
      message: 'Login successfull',
      data: {
        id: rider.id,
        firstName: rider.firstName,
        lastName: rider.lastName,
       emailAddress: rider.emailAddress,
      },
      token: token,
    })
  } catch (error) {
    next(error)
  }
}

exports.riderResetPassword = async (req, res, next) => {
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

    const rider = await Rider.findOne({ where: { id: decoded.id } })
    if (!rider) {
      return res.status(404).json({
        message: 'Rider not found',
      })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    rider.password = hashedPassword

    const tokenExpiry = Date.now() + 1000 * 60 * 5

    if (Date.now() > tokenExpiry) {
      return res.status(400).json({
        message: 'Password expired, resend a password',
      })
    }

    rider.resetPasswordExpiredAt = tokenExpiry

    await rider.save()

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

exports.riderForgotPassword = async (req, res, next) => {
  try {
    const { emailAddress} = req.body

    const ridersForgot = await Rider.findOne({
      where: {
        emailAddress: emailAddress.toLowerCase()
      },
    })
    if (!ridersForgot) {
      return res.status(404).json({
        message: 'Rider not found',
      })
    }

    const token = jwt.sign({ id: Rider.id, businessEmail: Rider.businessEmail }, process.env.JWT_SECRET, {
      expiresIn: '20m',
    })

    const link = `${req.protocol}://${req.get('host')}/user/reset/password/${token}`

    const emailOptions = {
      emailAddress: Rider.emailAddress,
      subject: 'Reset password',
      html: forgotPasswordTemplate(link, Rider.firstName),
    }

    await emailSender(emailOptions)
    return res.status(200).json({
      message: 'forgot password request sent',
    })
  } catch (error) {
    next(error)
  }
}


exports.changeRiderPassword = async (req, res, next) => {
  const { id } = req.rider
  const { oldPassword, newPassword, confirmPassword } = req.body
  try {
    const riderChange = await Rider.findOne({ where: { id } })
    if (!riderChange) {
      return res.status(404).json({
        message: 'Rider Password not found',
      })
    }

    const checkOldPassword = await bcrypt.compare(oldPassword, riderChange.password)
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

   riderChange.password = hashedPassword
    await riderChange.save()

    return res.status(200).json({
      message: 'Password changed successfully',
    })
  } catch (error) {
    next(error)
  }
}


exports.getAllRiders = async(req,res,next )=>{
 try {
  const riders = await Rider.findAll()
  if (riders.length === 0) {
      return res.status(400).json({
        message: 'No riders found',
        data: [],
      })
    }

    return res.status(200).json({
      message: 'Riders retrieved successfully',
      data: riders,
    })
 } catch (error) {
    next(error)
 }
}


exports.getOneRider = async (req, res, next) => {
  const { riderId } = req.params
  try {
    const getRider = await Rider.findByPk(riderId)
    if (!getRider) {
      return res.status(404).json({
        message: 'Rider not found',
      })
    }

    return res.status(200).json({
      message: 'Rider retrieved successfully',
      data: getRider,
    })
  } catch (error) {
    next(error)
  }
}