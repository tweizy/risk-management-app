'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Event', [
      { description: 'Risk Identified', event_date: new Date() },
      { description: 'Mitigation Action Taken', event_date: new Date() },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Event', null, {});
  }
};
