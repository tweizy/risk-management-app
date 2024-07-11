'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Project', [
      { description: 'Project Alpha', start_date: new Date(), status: 'Active' },
      { description: 'Project Beta', start_date: new Date(), status: 'Completed' },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Project', null, {});
  }
};
