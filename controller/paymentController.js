const { Payment, Order, User } = require('../models')
const axios = require('axios')

const SECRET_KEY = process.env.KORAPAY_SECRET_KEY

exports.initializePayment = async (req, res, next) => {
  const { orderId } = req.params
  const userId = req.user.id
  try {
    const order = await Order.findOne({
      where: { id: orderId, userId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'email'],
        },
      ],
    })
    console.log(order.totalPrice)

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      })
    }

    if (!order.totalPrice || order.totalPrice <= 0) {
      return res.status(400).json({
        message: 'Invalid order amount',
      })
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({
        message: 'Order already paid',
      })
    }

    const reference = `REF-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    const data = {
      amount: order.totalPrice,
      currency: 'NGN',
      reference: reference,
      customer: {
        name: order.user.firstName + order.user.lastName,
        email: order.user.email,
      },
    }
    // console.error('Data', data)

    const response = await axios.post('https://api.korapay.com/merchant/api/v1/charges/initialize', data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SECRET_KEY}`,
      },
    })
    // console.error('Res', response)
    const checkoutUrl = response?.data?.data?.checkout_url

    await Payment.create({
      orderId: order.id,
      reference,
      amount: order.totalPrice,
      currency: 'NGN',
      paymentMethod: 'card',
      status: 'pending',
    })

    return res.status(201).json({
      message: 'payment initialized successfully',
      data: {
        reference,
        checkoutUrl,
      },
    })
  } catch (error) {
    next(error)
  }
}
