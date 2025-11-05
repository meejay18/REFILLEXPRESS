const { Vendor } = require('../models');

exports.updateVendorSettings = async (req, res, next) => {
  try {
    const { vendorId } = req.params;
    const updates = req.body;

    const vendor = await Vendor.findByPk(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    const allowedFields = [
      'pricePerKg',
      'minimumOrder',
      'openingTime',
      'closingTime',
      'businessAvailability',
      'inStock',
      'newOrderAlerts',
      'customerMessages',
      'reviewNotifications'
    ];

    allowedFields.forEach(field => {
      if (updates.hasOwnProperty(field)) {
        vendor[field] = updates[field];
      }
    });

    await vendor.save();

    res.status(200).json({
      message: 'Settings updated successfully',
      updatedFields: updates
    });
  } catch (error) {
    next(error);
  }
};
