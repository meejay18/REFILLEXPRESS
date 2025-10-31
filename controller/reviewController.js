

const { Review, User } = require('../models');

// GET /reviews
exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }],
      order: [['timestamp', 'DESC']]
    });
    res.status(200).json(reviews);
  } catch (error) {
   next(error)
  }
};

// POST /reviews
exports.createReview = async (req, res, next) => {
  try {
    const userId = req.user.id


    const user = await User.findByPk(userId)
    if(!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    const { rating, message } = req.body;

    if ( !rating || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const review = await Review.create({ rating, message });
    res.status(201).json({
      id: review.id,
      status: 'success',
      message: 'Review submitted successfully.'
    });
  } catch (error) {
    next(error)
  }
};

// GET /reviews/summary
exports.getReviewSummary = async (req, res, next) => {
  try {
    const totalReviews = await Review.count();
    const ratingDistribution = {};

    for (let i = 1; i <= 5; i++) {
      ratingDistribution[i] = await Review.count({ where: { rating: i } });
    }

    res.status(200).json({ totalReviews, ratingDistribution });
  } catch (error) {
    next(error)
  }
};

// GET /reviews/stats
exports.getReviewStats = async (req, res, next) => {
  try {
    const totalReviews = await Review.count();
    let weightedSum = 0;
    const ratingCounts = {};

    for (let i = 1; i <= 5; i++) {
      const count = await Review.count({ where: { rating: i } });
      ratingCounts[i] = count;
      weightedSum += i * count;
    }

    const averageRating = totalReviews ? (weightedSum / totalReviews).toFixed(2) : 0;
    const percentageBreakdown = {};

    for (let i = 1; i <= 5; i++) {
      percentageBreakdown[i] = totalReviews
        ? ((ratingCounts[i] / totalReviews) * 100).toFixed(1)
        : '0.0';
    }

    res.status(200).json({
      averageRating: Number(averageRating),
      percentageBreakdown,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
   next(error)
  }
};

