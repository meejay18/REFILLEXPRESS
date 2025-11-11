const { Review, User, Vendor,Order } = require('../models')


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
      data: reviews
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



exports.createUserReview = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { vendorId } = req.params
    const { rating, message } = req.body

    if (!rating || !message) {
      return res.status(400).json({
        status: 'error',
        message: 'Rating and message are required.',
      })
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        status: 'error',
        message: 'Rating must be between 1 and 5.',
      })
    }

    const user = await User.findByPk(userId)
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found.' })
    }

    const vendor = await Vendor.findByPk(vendorId)
    if (!vendor) {
      return res.status(404).json({ status: 'error', message: 'Vendor not found.' })
    }

    const hasOrdered = await Order.findOne({
      where: { userId, vendorId, status: 'completed' },
    })
    if (!hasOrdered) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only review vendors you have purchased from.',
      })
    }

  

    const existingReview = await Review.findOne({ where: { userId, vendorId } })
    if (existingReview) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already submitted a review for this vendor.',
      })
    }

    const review = await Review.create({
      rating,
      message,
      vendorId,
      userId,
    })

    const reviews = await Review.findAll({ where: { vendorId } })
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    vendor.rating = avgRating
    await vendor.save()


    res.status(201).json({
      status: 'success',
      message: 'Review submitted successfully.',
      data: {
        reviewId: review.id,
        vendorId,
        rating,
        message,
      },
    })
  } catch (error) {
    // console.error('Error creating review:', error)
    // res.status(500).json({
    //   status: 'error',
    //   message: 'An error occurred while submitting the review.',
    // })
    next(error)
  }
}
 exports.getVendorReviews = async (req, res, next) => {
  try {
    const { vendorId } = req.params;
    const reviews = await Review.findAll({
      where: { vendorId },
      include: [
        { model: User, as: 'user', attributes: ['firstName', 'lastName'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      message: 'Vendor reviews fetched successfully',
      reviews,
    });
  } catch (error) {
    next(error);
  }
};



exports.getVendorReviewSummary = async (req, res, next) => {
  try {
    const { vendorId } = req.params;

    const reviews = await Review.findAll({ where: { vendorId } });
    const totalReviews = reviews.length;
    const averageRating = totalReviews
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
      : '0.0';

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => ratingDistribution[r.rating]++);

    res.status(200).json({
      vendorId,
      averageRating,
      totalReviews,
      ratingDistribution,
    });
  } catch (error) {
    next(error);
  }
};




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

// controllers/reviewController.js



