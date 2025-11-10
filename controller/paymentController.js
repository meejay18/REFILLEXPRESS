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
      redirect_url: `https://refill-xpress.vercel.app/userdashboard/userPayment?orderId=${order.id}&reference=${reference}`,
    }

    const response = await axios.post('https://api.korapay.com/merchant/api/v1/charges/initialize', data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SECRET_KEY}`,
      },
    })
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

exports.verifyPayment = async (req, res, next) => {
  const { event, data } = req.body
  try {
    if (event === 'charge.success') {
      const payment = await Payment.findOne({
        where: { reference: data.reference },
      })
      if (!payment) {
        return reference.status(404).json({
          message: 'Payment record not found',
        })
      }

      const order = await Order.findOne({
        where: { id: payment.orderId },
      })

      if (!order) {
        return res.status(404).json({
          message: 'Order not found or unauthorized',
        })
      }

      payment.status = 'success'
      payment.paidAt = new Date()
      await payment.save()

      order.paymentStatus = 'paid'
      await order.save()

      return res.status(200).json({
        message: 'Payment verified successfully',
        data: {
          orderId: order.id,
          paymentStatus: order.paymentStatus,
          transactionDetails: transaction,
        },
      })
    }

    if (event === 'charge.failed') {
      const payment = await Payment.findOne({
        where: { reference: data.reference },
      })
      if (!payment) {
        return reference.status(404).json({
          message: 'Payment record not found',
        })
      }

      const order = await Order.findOne({
        where: { id: payment.orderId },
      })

      if (!order) {
        return res.status(404).json({
          message: 'Order not found or unauthorized',
        })
      }

      payment.status = 'failed'
      payment.paidAt = new Date()
      await payment.save()

      order.paymentStatus = 'failed'
      await order.save()

      return res.status(200).json({
        message: 'Payment failed',
        data: {
          orderId: order.id,
          paymentStatus: order.paymentStatus,
          transactionDetails: transaction,
        },
      })
    }
  } catch (error) {
    next(error)
  }
}
// exports.verifyPayment = async (req, res, next) => {
//   const { reference } = req.query
//   try {
//     const userId = req.user.id

//     const response = await axios.get(`https://api.korapay.com/merchant/api/v1/charges/${reference}`, {
//       headers: {
//         Authorization: `Bearer ${SECRET_KEY}`,
//       },
//     })

//     const transaction = response?.data?.data
//     if (!transaction || transaction.status !== 'success') {
//       return res.status(400).json({
//         message: 'Payment verification failed',
//       })
//     }

//     const payment = await Payment.findOne({
//       where: { reference },
//     })
//     if (!payment) {
//       return reference.status(404).json({
//         message: 'Payment record not found',
//       })
//     }

//     const order = await Order.findOne({
//       where: { id: payment.orderId, userId },
//     })

//     if (!order) {
//       return res.status(404).json({
//         message: 'Order not found or unauthorized',
//       })
//     }

//     payment.status = 'success'
//     payment.paidAt = new Date()
//     await payment.save()

//     order.paymentStatus = 'paid'
//     await order.save()

//     return res.status(200).json({
//       message: 'Payment verified successfully',
//       data: {
//         orderId: order.id,
//         paymentStatus : order.paymentStatus,
//         transactionDetails : transaction
//       },
//     })

//   } catch (error) {
//     next(error)
//   }
// }
