'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vendors', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      businessName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      businessEmail: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      businessPhoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      businessAddress: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      otp: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      otpExpiredAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      verificationStatus: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
      },
      verificationDocuments: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      vendorImage: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      pricePerKg: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      minimumOrder: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      openingTime: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      closingTime: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isAvailable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('vendors')
  },
}
