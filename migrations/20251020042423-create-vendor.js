'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Vendors', {
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
      fullName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      residentialAddress: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: true,
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
      isVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
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
      operatingHours: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      rating: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0,
      },
      status: {
        type: Sequelize.ENUM('verified', 'unverified', 'out-of-stock'),
        defaultValue: 'unverified',
      },

      closingTime: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isAvailable: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      businessAvailability: {
        type: Sequelize.ENUM('open', 'closed'),
        allowNull: false,
        defaultValue: 'open',
      },
      inStock: {
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
    await queryInterface.dropTable('Vendors')
  },
}
