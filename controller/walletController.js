const { Order, Wallet } = require('../models')

exports.distributeFunds = async (req, res, next) => {
  const { orderId } = req.params
  try {
    const order = await Order.findByPk(orderId, {
      include: ['vendor', 'rider'],
    })

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      })
    }

    if (order.paymentStatus !== 'paid') {
      return res.status(400).json({
        message: 'No payment for this order',
      })
    }

    const vendorWallet = await Wallet.findOne({
      where: { vendorId: order.vendorId },
    })
    if (!vendorWallet) {
      return res.status(400).json({
        message: 'Vendor Wallet not found',
      })
    }
    await vendorWallet.increment('balance', { by: order.vendorEarning })
    await vendorWallet.reload()

    const riderWallet = await Wallet.findOne({
      where: { riderId: order.riderId },
    })
    if (!riderWallet) {
      return res.status(400).json({
        message: 'Rider  Wallet not found',
      })
    }
    await riderWallet.increment('balance', { by: order.riderEarning })
    await vendorWallet.reload()

    return res.status(200).json({
      message: 'Wallets updated successfully',
      vendorWallet: {
        vendorId: vendorWallet.vendorId,
        newBalance: vendorWallet.balance + order.vendorEarning,
      },
      riderWallet: {
        riderId: riderWallet.riderId,
        newBalance: riderWallet.balance + order.riderEarning,
      },
    })
  } catch (error) {
    next(error)
  }
}
