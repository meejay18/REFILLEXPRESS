'use strict'
const { Model, UUIDV4 } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Wallet.belongsTo(models.Vendor, {
        foreignKey: 'vendorId',
        as: 'vendor',
      })

      Wallet.belongsTo(models.Rider, {
        foreignKey: 'riderId',
        as: 'rider',
      })

      Wallet.hasMany(models.Transaction, {
        foreignKey: 'walletId',
        as: 'transactions',
      })
    }
  }
  Wallet.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      balance: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: true,
      },
      vendorId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      riderId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Wallet',
    }
  )
  return Wallet
}
