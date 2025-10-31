'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class VendorKyc extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      VendorKyc.belongsTo(models.Vendor, {
        foreignKey: 'vendorId',
        as: 'vendor',
        onDelete: 'CASCADE',
      })
    }
  }
  VendorKyc.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      vendorId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      businessLicense: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      taxRegistrationCertificate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      nationalId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      businessInsurance: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      verificationStatus: {
        type: DataTypes.ENUM('pending', 'verified', 'rejected'),
        defaultValue: 'pending',
      },
      bankAccountName: {
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
      automaticPayouts: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'VendorKyc',
    }
  )
  return VendorKyc
}
