const emailSender = require('../middleware/nodemailer')
const { User } = require('../models')
const bcrypt = require('bcryptjs')
const signUpTemplate = require("../utils/emailTemplate")

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
      email,
      phoneNumber,
      password: hashedPassword,
      otp: otp,
      otpExpiredAt: Date.now() + 1000 * 60,
    })

    const emailOptions = {
      email: newUser.email,
      subject: 'Sign up successful',
      html: signUpTemplate(otp, newUser.firstName),
    }

    await emailSender(emailOptions)

    return res.status(201).json({
      message: 'User created successfully',
      data: newUser,
    })
  } catch (error) {
    next(error)
  }
}
