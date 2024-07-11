'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('MitigationAction', [
      { risk_id: 1, action_description: 'Implement hedge strategy', assigned_to: 2, due_date: new Date(), status: 'In Progress' },
      { risk_id: 2, action_description: 'Review and update insurance policy', assigned_to: 3, due_date: new Date(), status: 'Pending' },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('MitigationAction', null, {});
  }
};
