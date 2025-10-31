'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      // Relationships
      Order.belongsTo(models.User, { foreignKey: 'userId', as: 'user' })
      Order.belongsTo(models.Vendor, { foreignKey: 'vendorId', as: 'vendor' })
      Order.belongsTo(models.Rider, { foreignKey: 'riderId', as: 'rider' })
    }
  }

  Order.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      orderNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      vendorId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      riderId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      gasType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      pickupAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      deliveryAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      totalPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },

      status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'in_transit', 'delivered', 'cancelled'),
        defaultValue: 'pending',
      },
      paymentStatus: {
        type: DataTypes.ENUM('unpaid', 'paid', 'failed'),
        defaultValue: 'unpaid',
      },
      scheduledTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      deliveryFee: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Order',
      timestamps: true,
    }
  )

  return Order
}
