'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      orderNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      vendorId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'vendors',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      riderId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Riders',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      gasType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      pickupAddress: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      deliveryAddress: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'confirmed', 'in_transit', 'delivered', 'cancelled'),
        defaultValue: 'pending',
      },
      paymentStatus: {
        type: Sequelize.ENUM('unpaid', 'paid', 'failed'),
        defaultValue: 'unpaid',
      },
      scheduledTime: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deliveryFee: {
        type: Sequelize.FLOAT,
        allowNull: true,
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
    await queryInterface.dropTable('Orders')
  },
}
