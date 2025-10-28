const { Vendor, Order } = require('../models')

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


    const unitPrice = vendor.pricePerKg
    const totalPrice = unitPrice * quantity
    const deliveryFee = 2500

    const order = await Order.create({
      userId,
      vendorId: vendor.id,
      orderNumber,
      gasType,
      quantity,
      price:unitPrice,
      pickupAddress: vendor.businessAddress,
      deliveryAddress,
      totalPrice,
      scheduledTime,
      deliveryFee,
      status: 'pending',
      paymentStatus: 'unpaid',
    })

    return res.status(201).json({
      message: 'Order created successfully',
      order: order,
    })
  } catch (error) {
    next(error)
  }
}
