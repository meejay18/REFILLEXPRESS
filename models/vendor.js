'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Vendor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here


      // a vendor is also a user so it is tied to a user
      Vendor.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })

      // a vendor can have many orders
      // Vendor.hasMany(models.orders, {
      //   foreignKey: 'vendorId',
      //   as: 'orders',
      //   onDelete : "CASCADE",
      //   onUpdate: "CASCADE"
      // })
    }
  }
  Vendor.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
      userId: { type: DataTypes.UUID, allowNull: false },
      businessName: DataTypes.STRING,
      businessEmail: DataTypes.STRING,
      businessPhoneNumber: DataTypes.STRING,
      businessAddress: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      password: DataTypes.STRING,
      confirmPassword: DataTypes.STRING,
      agreeToTermsAndCondition: DataTypes.BOOLEAN,
      verificationStatus: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'Vendor',
    }
  )
  return Vendor
}
