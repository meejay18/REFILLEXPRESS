const { Review, User, Vendor } = require('../models')


exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      include: [
        { model: User, as: 'user', attributes: ['firstName', 'lastName'] },
        { model: Vendor, as: 'vendor', attributes: ['businessName'] },

      ],
      order: [['timestamp', 'DESC']],
    })
    res.status(200).json({
      message: 'Reviews fetched successfully',
    })
  } catch (error) {
    next(error)
  }
}



exports.createReview = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { vendorId } = req.params
    const { rating, message } = req.body

    const user = await User.findByPk(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const vendor = await Vendor.findByPk(vendorId)
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' })
    }

    if (!rating || !message) {
      return res.status(400).json({ error: 'Rating and message are required' })
    }

    const review = await Review.create({
      rating,
      message,
      vendorId,
      userId,
    })

    res.status(201).json({
      id: review.id,
      status: 'success',
      message: 'Review submitted successfully.',
    })
  } catch (error) {
    next(error)
  }
}



exports.getReviewSummary = async (req, res, next) => {
  try {
    const totalReviews = await Review.count()
    const ratingDistribution = {}

    for (let i = 1; i <= 5; i++) {
      ratingDistribution[i] = await Review.count({ where: { rating: i } })
    }

    res.status(200).json({ totalReviews, ratingDistribution })
  } catch (error) {
    next(error)
  }
}



exports.getReviewStats = async (req, res, next) => {
  try {
    const totalReviews = await Review.count()
    let weightedSum = 0
    const ratingCounts = {}

    for (let i = 1; i <= 5; i++) {
      const count = await Review.count({ where: { rating: i } })
      ratingCounts[i] = count
      weightedSum += i * count
    }

    const averageRating = totalReviews ? (weightedSum / totalReviews).toFixed(2) : 0
    const percentageBreakdown = {}

    for (let i = 1; i <= 5; i++) {
      percentageBreakdown[i] = totalReviews ? ((ratingCounts[i] / totalReviews) * 100).toFixed(1) : '0.0'
    }

    res.status(200).json({
      averageRating: Number(averageRating),
      percentageBreakdown,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
}



// exports.getVendorReviews = async (req, res, next) => {
//   try {
//     const { vendorId } = req.params

//     const vendor = await Vendor.findByPk(vendorId)
//     if (!vendor) {
//       return res.status(404).json({ message: 'Vendor not found' })
//     }

//     const reviews = await Review.findAll({
//       where: { vendorId },
//       include: [
//         { model: User, as: 'user', attributes: ['firstName', 'lastName'] },
//         { model: Vendor, as: 'vendor', attributes: ['businessName'] },
//       ],
//       order: [['timestamp', 'DESC']],
//     })

//     res.status(200).json(reviews)
//   } catch (error) {
//     next(error)
//   }
// }
