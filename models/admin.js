'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Admin.init({
    id: {
  type: DataTypes.UUID,
  primaryKey: true,
  defaultValue: DataTypes.UUIDV4
},

    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    password: DataTypes.STRING,
    role: {
  type: DataTypes.ENUM('super-admin', 'admin'),
  allowNull: false,
  defaultValue: 'admin',
},
status: {
  type: DataTypes.ENUM('active', 'inactive', 'blocked'),
  allowNull: false,
  defaultValue: 'active',
},

    status: DataTypes.STRING,
    resetPasswordToken: DataTypes.STRING,
    resetPasswordExpiredAt: DataTypes.DATE,
    lastLogin: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Admin',
  });
  return Admin;
};