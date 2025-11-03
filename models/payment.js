'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Payment.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      orderId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      reference: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        defaultValue: 'NGN',
      },
      paymentMethod: {
        type: DataTypes.ENUM('card', 'bank-transfer'),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('card', 'bank-transfer'),
        defaultValue: 'pending',
      },
      paidAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'Payment',
    }
  )
  return Payment
}
