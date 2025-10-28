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
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
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
      // otp: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      // },
      // otpExpiredAt: {
      //   type: DataTypes.DATE,
      //   allowNull: true,
      // },
      operatingArea: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    //   rating:{
    //   type: DataTypes.FLOAT,
    //   defaultValue:0
    //   },
    //   status:{
    //  type: DataTypes.ENUM('online','offline'),
    //  defaultValue:'offline',
    //   },
    //   earningsToday:{
    //   type: DataTypes.FLOAT,
    //   defaultValue: 0,
    //   },
    },
    {
      sequelize,
      modelName: 'Rider',
    }
  )
  return Rider
}
