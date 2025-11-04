const { Order, Review } = require ('../models');
const { Op } = require('sequelize');
const { sequelize } = require ('../models')

exports.getVendorAnalytics = async (req, res, next) => {
  try {
    const { vendorId } = req.params;

    const totalOrders = await Order.count({ where: { vendorId } });
    const completedOrders = await Order.count({ where: { vendorId, status: 'completed' } });
    const completionRate = totalOrders ? ((completedOrders / totalOrders) * 100).toFixed(1) : '0.0';

    const reviews = await Review.findAll({ where: { vendorId } });
    const totalReviews = reviews.length;
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    reviews.forEach(r => ratingCounts[r.rating]++);

    const averageRating = totalReviews
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(2)
      : '0.0';

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const monthlyRevenue = await Order.sum('totalPrice', {
      where: {
        vendorId,
        status: 'completed',
        createdAt: {
          [Op.and]: [
            sequelize.where(sequelize.fn('MONTH', sequelize.col('createdAt')), currentMonth),
            sequelize.where(sequelize.fn('YEAR', sequelize.col('createdAt')), currentYear)
          ]
        }
      }
    });

    res.status(200).json({
      totalOrders,
      completedOrders,
      completionRate,
      totalReviews,
      averageRating,
      ratingDistribution: ratingCounts,
      monthlyRevenue: monthlyRevenue || 0
    });
  } catch (error) {
    next(error);
  }
};

exports.getReviewSummary = async (req, res, next) => {
  try {
    const { vendorId } = req.params;
    const totalReviews = await Review.count({ where: { vendorId } });
    const ratingDistribution = {};

    for (let i = 1; i <= 5; i++) {
      ratingDistribution[i] = await Review.count({ where: { vendorId, rating: i } });
    }

    res.status(200).json({ totalReviews, ratingDistribution });
  } catch (error) {
    next(error);
  }
};


exports.getOrderStats = async (req, res, next) => {
  try {
    const { vendorId } = req.params;

    const totalOrders = await Order.count({ where: { vendorId } });
    const completedOrders = await Order.count({ where: { vendorId, status: 'completed' } });

    const monthlyRevenue = await Order.findAll({
      where: { vendorId, status: 'completed' },
      attributes: [
        [sequelize.fn('MONTH', sequelize.col('createdAt')), 'month'],
        [sequelize.fn('SUM', sequelize.col('totalPrice')), 'revenue']
      ],
      group: ['month'],
      order: [[sequelize.literal('month'), 'ASC']]
    });

    res.status(200).json({
      totalOrders,
      completedOrders,
      monthlyRevenue
    });
  } catch (error) {
    next(error);
  }
};
