const emailSender = require('../middleware/nodemailer')
const  {Rider} = require('../models')
// const Rider = db.Rider
const bcrypt = require('bcryptjs')
const { signUpTemplate } = require('../utils/emailTemplate')
const jwt = require('jsonwebtoken')

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
    
    // const existingRider = await Rider.findOne({ where: { emailAddress } })
    // console.log('Rider model check:', Rider)

    // if (existingRider) {
    //   return res.status(400).json({
    //     message: 'Rider already exists',
    //   })
    // }
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
    //   otp: otp,
    //   otpExpiredAt: Date.now() + 1000 * 60 * 5,
    })

    // const emailOptions = {
    //   email: newRider.email,
    //   subject: 'Sign up successfull',
    //   html: signUpTemplate(otp, newRider.firstName),
    // }
    // await emailSender(emailOptions)

    return res.status(201).json({
      message: 'Rider created successfully',
      data: {
        firstName: newRider.firstName,
        lastName: newRider.lastName,
      email: newRider.email,
     newRider
      },
    })
  } catch (error) {
    next(error)
  }
}