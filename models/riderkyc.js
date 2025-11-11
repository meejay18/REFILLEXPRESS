'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class RiderKyc extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      RiderKyc.belongsTo(models.Rider, {
        foreignKey: 'riderId',
        as: 'rider',
        onDelete: 'CASCADE',
      })
    }
  }
  RiderKyc.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      riderId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      residentialAddress: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contactName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contactPhone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      vehicleType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      vehicleMake: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      vehicleModel: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      registrationNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      licensePlate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      accountHolderName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bankName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      accountNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      verificationStatus: {
        type: DataTypes.ENUM('not completed', 'pending', 'verified', 'rejected'),
        defaultValue: 'pending',
      },
      driversLicense: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      vehicleRegistration: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ownerIdCard: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      utilityBill: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'RiderKyc',
    }
  )
  return RiderKyc
}
