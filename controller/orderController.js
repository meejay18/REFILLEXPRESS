const emailSender = require('../middleware/nodemailer')
const { Vendor, Order, User } = require('../models')
const { placeOrderTemplate } = require('../utils/emailTemplate')

exports.placeOrder = async (req, res, next) => {
  const { gasType, quantity, deliveryAddress, scheduledTime } = req.body
  try {
    const userId = req.user.id

    const vendor = await Vendor.findOne({ where: { isAvailable: true } })
    if (!vendor) {
      return res.status(404).json({
        message: 'No available vendors at the moment',
      })
    }

    const user = await User.findOne({ where: { id: userId } })
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    const unitPrice = vendor.pricePerKg
    const totalPrice = unitPrice * quantity
    const deliveryFee = 2500

    const date = new Date()
    const orderNumber = `REF-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(
      date.getDate()
    ).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`

    const order = await Order.create({
      userId,
      vendorId: vendor.id,
      riderId: null,
      orderNumber,
      gasType,
      quantity,
      price: unitPrice,
      pickupAddress: vendor.businessAddress,
      deliveryAddress,
      totalPrice,
      scheduledTime,
      deliveryFee,
      status: 'pending',
      paymentStatus: 'unpaid',
    })

    const emailOptions = {
      email: user.email,
      subject: 'Order placed Successfully',
      html: placeOrderTemplate(
        orderNumber,
        user.firstName,
        quantity,
        totalPrice,
        deliveryAddress,
        vendor.businessName
      ),
    }

    await emailSender(emailOptions)

    return res.status(201).json({
      message: 'Order created successfully, A rider will be contact you shortly to complete your order',
      order: order,
    })
  } catch (error) {
    next(error)
  }
}
