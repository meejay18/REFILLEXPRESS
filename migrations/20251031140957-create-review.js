'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reviews', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
           references: {
      model: 'Users',
      key: 'id'
    }, 
    onUpdate: 'CASCADE',
  onDelete: 'CASCADE',
  
    vendorId: {
  type: Sequelize.UUID,
  allowNull: false,
  references: {
    model: 'Vendors',
    key: 'id'
  },
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
}
      },
      rating: {
        type: Sequelize.INTEGER
      },
      message: {
        type: Sequelize.TEXT
      },
      timestamp: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Reviews');
  }
};