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
      // a user can have one vendor profile if they are a vendor
      User.hasOne(models.Vendor, {
        foreignKey: 'userId',
        as: 'vendor',
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })

      // User.hasMany(models.orders, {
      //   foreignKey: 'userId',
      //   as: 'orders',
      //   onUpdate: "CASCADE",
      //   onDelete: "CASCADE",
      // })
    }
  }
  User.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      password: DataTypes.STRING,
      isVerified: DataTypes.BOOLEAN,
      role: DataTypes.STRING,
      agreedToTerms: DataTypes.BOOLEAN,
      verifiedToken: DataTypes.STRING,
      verifiedTokenExpiredAt: DataTypes.DATE,
      resetPasswordToken: DataTypes.STRING,
      resetPasswordExpiredAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'User',
    }
  )
  return User
}
