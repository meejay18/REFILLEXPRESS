'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('VendorKycs', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      vendorId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Vendors',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      businessLicense: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      taxRegistrationCertificate: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      nationalId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      businessInsurance: {
        type: Sequelize.STRING,
         allowNull: true,
      },
      verificationStatus: {
        type: Sequelize.ENUM('pending', 'verified', 'rejected'),
        defaultValue: "pending"
      },
      bankAccountName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      bankName: {
        type: Sequelize.STRING,
         allowNull: true
      },
      accountNumber: {
        type: Sequelize.STRING,
         allowNull: true
      },
      automaticPayouts: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    await queryInterface.dropTable('VendorKycs')
  },
}
