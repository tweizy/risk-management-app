'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Attachment', [
      { risk_id: 1, file_path: 'document1.pdf' },
      { risk_id: 2, file_path: 'document2.pdf' },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Attachment', null, {});
  }
};
