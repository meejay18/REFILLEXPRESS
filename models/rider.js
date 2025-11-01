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
      otpExpiredAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      operatingArea: {
        type: DataTypes.STRING,
        allowNull: false,
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
