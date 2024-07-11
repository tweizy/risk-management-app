'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'first_name', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn('Users', 'last_name', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'first_name', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('Users', 'last_name', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
