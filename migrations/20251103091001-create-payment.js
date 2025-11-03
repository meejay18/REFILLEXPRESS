'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Payments', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      orderId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      reference: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      currency: {
        type: Sequelize.STRING,
        defaultValue: 'NGN',

      },
      paymentMethod: {
        type: Sequelize.ENUM('card', 'bank-transfer'),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'success', 'failed'),
        defaultValue: 'pending',
      },
      paidAt: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('Payments')
  },
}
