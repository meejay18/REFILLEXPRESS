'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Riders', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      phoneNumber: {
        type: Sequelize.STRING,
        unique: true,
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
      },
      earnings: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'inactive',
      },
      rating: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      refills: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      activeTime: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      totalRefills: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      totalEarnings: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      onTime: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.dropTable('Riders')
  },
}
