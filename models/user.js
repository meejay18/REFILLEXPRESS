'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Order, {
        foreignKey: 'userId',
        as: 'orders',
      })

      User.hasMany(models.Review, {
        foreignKey: 'userId',
        as: 'reviews',
      })

      User.belongsToMany(models.Vendor, {
        through: models.Order,
        foreignKey: 'userId',
        otherKey: 'vendorId',
        as: 'vendors',
      })
    }
  }
  User.init(
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
      profilePicture: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      residentialAddress: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      home: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      office: {
        type: DataTypes.STRING,
        allowNull: true,
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
      role: {
        type: DataTypes.ENUM('user', 'vendor', 'courier', 'admin'),
        allowNull: false,
        defaultValue: 'user',
        validate: {
          isIn: [['user', 'vendor', 'courier', 'admin']],
        },
      },
      verifiedToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      verifiedTokenExpiredAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetPasswordExpiredAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'User',
      timestamps: true,
    }
  )
  return User
}
