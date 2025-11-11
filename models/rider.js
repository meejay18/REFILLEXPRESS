'use strict'
const { Model, DATE } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Rider extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Rider.hasMany(models.Order, {
        foreignKey: 'riderId',
        as: 'rider',
      })

      Rider.hasOne(models.RiderKyc, {
        foreignKey: 'riderId',
        as: 'kyc',
      })

      Rider.belongsToMany(models.Vendor, {
        through: models.Order,
        foreignKey: 'RiderId',
        otherKey: 'vendorId',
        as: 'vendors',
      })
    }
  }
  Rider.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      residentialAddress: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
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
      earnings: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'inactive',
      },
      rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      refills: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      activeTime: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      totalRefills: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      totalEarnings: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      onTime: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        unique: true,
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
      kycVerificationStatus: {
        type: DataTypes.ENUM('not completed', 'pending', 'approved', 'rejected'),
        defaultValue: 'pending',
      },
      otpExpiredAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      earnings: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'inactive',
      },
      rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      refills: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      activeTime: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      totalRefills: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      totalEarnings: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      onTime: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Rider',
      timestamps: true,
    }
  )
  return Rider
}
