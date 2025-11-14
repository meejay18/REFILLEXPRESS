const emailSender = require('../middleware/nodemailer')
const { Op } = require('sequelize')
const { Vendor, Order, User, Rider } = require('../models')
const {
  placeOrderTemplate,
  acceptOrderStatusTemplate,
  completeOrderStatusTemplate,
  bulkEmailRiderTemplate,
} = require('../utils/emailTemplate')

exports.placeOrder = async (req, res, next) => {
  const { cylinderSize, quantity, deliveryAddress, scheduledTime } = req.body
  const { vendorId } = req.params
  try {
    const userId = req.user.id

    const vendor = await Vendor.findOne({
      where: { id: vendorId, isAvailable: true, pricePerKg: { [Op.ne]: null } },
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

    // const riders = await Rider.findAll({
    //   where: {
    //     status: 'active',
    //   },
    // })

    // for (const rider of riders) {
    //   try {
    //     const riderOptions = {
    //       email: rider.email,
    //       subject: 'Order Notification',
    //       html: bulkEmailRiderTemplate(
    //         rider.firstName,
    //         order.orderNumber,
    //         vendor.businessName,
    //         user.residentialAddress,
    //         order.quantity,
    //         order.cylinderSize
    //       ),
    //     }
    //     await emailSender(riderOptions)
    //     // console.log('bulk email sent', rider.email)
    //   } catch (error) {
    //     console.log(error.message)
    //   }
    // }
    return res.status(201).json({
      message: 'Order created successfully, A rider will be contact you shortly to complete your order',
      order: order,
    })
  } catch (error) {
    next(error)
  }
}
exports.deleteOrder = async (req, res, next) => {
  const userId = req.user.id
  const { orderId } = req.params
  try {
    const order = await Order.findOne({
      where: {
        id: orderId,
        userId,
      },
      include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }],
    })
    if (!order) {
      return res.status(404).json({
        message: 'Order does not exist',
      })
    }

    if (order.status === 'delivered' || order.status === 'completed') {
      return res.status(400).json({
        message: 'You cannot delete an order that has already been completed or delivered',
      })
    }

    const deletedOrder = await order.destroy()

    return res.status(200).json({
      message: 'order deleted successfully',
      data: deletedOrder,
    })
  } catch (error) {
    next(error)
  }
}

exports.cancelOrder = async (req, res, next) => {
  const userId = req.user.id
  const { orderId } = req.params
  try {
    const order = await Order.findOne({
      where: { id: orderId, userId },
      include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }],
    })

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      })
    }

    if (['delivered', 'completed'].includes(order.status)) {
      return res.status(400).json({
        message: 'You cannot cancel a completed or delivered order',
      })
    }

    order.status = 'cancelled'
    await order.save()

    return res.status(200).json({
      message: 'Order cancelled successfully',
      data: order,
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

exports.getOrderByStatus = async (req, res, next) => {
  const userId = req.user.id
  try {
    const statuses = ['pending', 'accepted', 'active', 'completed', 'cancelled']
    const result = {}

    for (const status of statuses) {
      const orders = await Order.findAll({
        where: {
          userId,
          status,
        },
        include: [{ model: Vendor, as: 'vendor', attributes: ['businessName'] }],
        order: [['createdAt', 'DESC']],
      })
      result[status] = orders
    }

    return res.status(200).json({
      message: 'Orders grouped by status',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

exports.confirmOrder = async (req, res, next) => {
  const { orderId, userId } = req.params
  const riderId = req.rider.id
  try {
    const order = await Order.findOne({
      where: {
        id: orderId,
        userId,
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'email'],
        },
      ],
    })

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      })
    }

    // if (order.status !== 'pending') {
    //   return res.status(400).json({
    //     message: 'No order for acceptance',
    //   })
    // }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // order.status = 'active'
    order.riderId = riderId
    order.otp = otp
    await order.save()

    const emailOptions = {
      email: order.user.email,
      subject: 'Order Confirmation Mail',
      html: acceptOrderStatusTemplate(
        order.user.firstName,
        order.orderNumber,
        order.quantity,
        order.totalPrice,
        otp
      ),
    }

    await emailSender(emailOptions)

    return res.status(200).json({
      message: 'Order confirmed successfully',
      data: order,
    })
  } catch (error) {
    next(error)
  }
}

exports.completeOrder = async (req, res, next) => {
  const { orderId } = req.params
  const riderId = req.rider.id

  try {
    const order = await Order.findOne({
      where: { id: orderId, riderId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'email'],
        },
      ],
    })

    if (!order) {
      return res.status(404).json({ message: 'Order not found or unauthorized' })
    }

    if (order.status !== 'active') {
      return res.status(400).json({ message: 'Only active orders can be completed' })
    }
    order.status = 'completed'
    order.completedAt = new Date()
    await order.save()

    const emailOptions = {
      email: order.user.email,
      subject: 'Order Completed',
      html: completeOrderStatusTemplate(
        order.user.firstName,
        order.orderNumber,
        order.quantity,
        order.totalPrice
      ),
    }

    await emailSender(emailOptions)

    return res.status(200).json({
      message: 'Order marked as completed',
      data: order,
    })
  } catch (error) {
    next(error)
  }
}

exports.getOneOrder = async (req, res, next) => {
  const { orderId } = req.params

  try {
    const order = await Order.findOne({
      where: { id: orderId },
      include: [
        {
          model: Vendor,
          as: 'vendor',
          attributes: [
            'id',
            'businessName',
            'businessAddress',
            'pricePerKg',
            'openingTime',
            'closingTime',
            'isAvailable',
          ],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'phoneNumber', 'residentialAddress'],
        },
      ],
    })

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      })
    }

    return res.status(200).json({
      message: 'Order retrieved successfully',
      data: order,
    })
  } catch (error) {
    next(error)
  }
}

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll()
    if (orders.length === 0) {
      return res.status(404).json({
        message: 'No orders found',
      })
    }

    return res.status(200).json({
      message: 'Orders retrieved successfully',
      data: orders,
    })
  } catch (error) {
    next(error)
  }
}

exports.trackOrder = async (req, res, next) => {
  const { orderId } = req.params
  const { status } = req.body
  const riderId = req.rider.id
  try {
    const validStatus = [
      'navigatingToCustomer',
      'pickedUpCylinder',
      'navigatingToVendor',
      'refillingCylinder',
      'returningToCustomer',
      'completed',
    ]

    if (!validStatus.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status',
      })
    }

    const order = await Order.findOne({
      where: {
        id: orderId,
        riderId,
      },
    })

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      })
    }

    // order.status = status
    await order.save()

    return res.status(200).json({
      message: `Order tracking updated to ${status}`,
      data: order,
    })
  } catch (error) {
    next(error)
  }
}

exports.getUserOrderTracking = async (req, res, next) => {
  const { orderId } = req.params
  const userId = req.user.id
  try {
    const order = await Order.findOne({
      where: {
        id: orderId,
        userId,
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'phoneNumber', 'residentialAddress'],
        },
        {
          model: Vendor,
          as: 'vendor',
          attributes: ['businessName', 'businessPhoneNumber', 'businessAddress'],
        },
        {
          model: Rider,
          as: 'rider',
          attributes: ['firstName', 'phoneNumber'],
        },
      ],
    })

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      })
    }

    const trackingStages = [
      'navigatingToCustomer',
      'pickedUpCylinder',
      'navigatingToVendor',
      'refillingCylinder',
      'returningToCustomer',
      'completed',
    ]

    const stageMap = {
      navigatingToCustomer: 0,
      pickedUpCylinder: 1,
      navigatingToVendor: 2,
      refillingCylinder: 3,
      returningToCustomer: 4,
      completed: 5,
    }

    const currentStageIndex = stageMap[order.status] ?? 0

    return res.status(200).json({
      message: 'Order status fetched successfully',
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        cylinderSize: order.cylinderSize,
        quantity: order.quantity,
        totalPrice: order.totalPrice,
        deliveryFee: order.deliveryFee,
        scheduledTime: order.scheduledTime,
        currentStatus: order.status,
        currentStage: trackingStages[currentStageIndex],
        trackingStages,
        vendor: {
          name: order.vendor.businessName,
          address: order.vendor.businessAddress,
          phone: order.vendor.businessPhoneNumber,
        },
        user: {
          name: order.user.firstName,
          address: order.user.phoneNumber,
          phone: order.user.residentialAddress,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}
