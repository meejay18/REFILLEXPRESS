'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Vendor extends Model {
    static associate(models) {
      // define associations here
      Vendor.hasMany(models.Order, {
        foreignKey: 'vendorId',
        as: 'orders',
      })

      Vendor.belongsToMany(models.User, {
        through: models.Order,
        foreignKey: 'vendorId',
        otherKey: 'userId',
        as: 'customers',
      })
    }
  }

  Vendor.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      businessName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      businessEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'This email is already registered',
        },
        validate: {
          isEmail: {
            msg: 'Please provide a valid email address',
          },
          notNull: {
            msg: 'Email is required',
          },
          notEmpty: {
            msg: 'Email field cannot be empty',
          },
        },
      },
      businessPhoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      businessAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      otp: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      otpExpiredAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      verificationStatus: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
      },
      verificationDocuments: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      vendorImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pricePerKg: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      minimumOrder: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      openingTime: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      closingTime: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'Vendor',
      tableName: 'vendors',
      timestamps: true,
    }
  )

  return Vendor
}
