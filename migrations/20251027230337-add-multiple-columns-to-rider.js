'use strict';

/** @type {import('sequelize-cli').Migration} */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('rider', 'otp', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('rider', 'otpExiredAt', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('rider', 'rating', {
      type: Sequelize.STRING,
      allowNull: true,
    });
     await queryInterface.addColumn('rider', ' status', {
      type: Sequelize.STRING,
      allowNull: true,
    });
     await queryInterface.addColumn('rider', 'earningsToday', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  // async down(queryInterface, Sequelize) {
  //   await queryInterface.removeColumn('Users', 'age');
  //   await queryInterface.removeColumn('Users', 'gender');
  //   await queryInterface.removeColumn('Users', 'address');
  // }
};
