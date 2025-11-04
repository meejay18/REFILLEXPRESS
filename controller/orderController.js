const emailSender = require('../middleware/nodemailer')
const { Op } = require('sequelize')
const { Vendor, Order, User } = require('../models')
const { placeOrderTemplate } = require('../utils/emailTemplate')

exports.placeOrder = async (req, res, next) => {
  const { cylinderSize, quantity, deliveryAddress, scheduledTime } = req.body
  try {
    const userId = req.user.id

    const vendor = await Vendor.findOne({
      where: { isAvailable: true },
      pricePerKg: { [Op.ne]: null },
      attributes: ['id', 'businessName', 'pricePerKg', 'businessAddress'],
    })
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

    const deliveryFee = 2500
    const unitPrice = parseFloat(vendor.pricePerKg)
    const totalPrice = unitPrice * quantity + deliveryFee

    const date = new Date()
    const orderNumber = `REF-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(
      date.getDate()
    ).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`

    const order = await Order.create({
      userId,
      vendorId: vendor.id,
      riderId: null,
      orderNumber,
      cylinderSize,
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

exports.getRecentOrders = async (req, res, next) => {
  const userId = req.user.id
  try {
    const orders = await Order.findAll({
      where: { userId },
      include: [{ model: Vendor, as: 'vendor', attributes: ['businessName'] }],
      order: [['createdAt', 'DESC']],
      limit: 5,
    })

    return res.status(200).json({
      message: 'recent orders retrieved',
      data: orders,
    })
  } catch (error) {
    next(error)
  }
}

exports.getAllVendorOrders = async (req, res, next) => {
  const vendorId = req.vendor.id
  try {
    const orders = await Order.findAll({
      where: { vendorId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    })

    const groupedOrders = {
      pending: [],
      active: [],
      completed: [],
      cancelled: [],
    }

    orders.forEach((order) => {
      if (groupedOrders[order.status]) {
        groupedOrders[order.status].push(order)
      }
    })

    return res.status(200).json({
      message: 'Orders retrieved by status',
      data: groupedOrders,
    })
  } catch (error) {
    next(error)
  }
}

exports.getActiveOrders = async (req, res, next) => {
  const userId = req.user.id
  try {
    const orders = await Order.findAll({
      where: {
        userId,
        status: ['active'],
      },
      include: [{ model: Vendor, as: 'vendor', attributes: ['businessName'] }],
    })

    return res.status(200).json({
      message: 'Active orders fetched successfully',
      data: orders,
    })
  } catch (error) {
    next(error)
  }
}

