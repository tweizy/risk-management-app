'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Entity', [
      { description: 'Corporate Division', type: 'Division' },
      { description: 'Finance Department', type: 'Service', parent_id: 1 },
      { description: 'HR Department', type: 'Service', parent_id: 1 },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Entity', null, {});
  }
};
