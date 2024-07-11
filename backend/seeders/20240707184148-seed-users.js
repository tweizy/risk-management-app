'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('password', 10);
    await queryInterface.bulkInsert('Users', [
      { email: 'admin@example.com', password: hashedPassword, entity_id: 1, role_id: 1 },
      { email: 'user1@example.com', password: hashedPassword, entity_id: 2, role_id: 2 },
      { email: 'user2@example.com', password: hashedPassword, entity_id: 3, role_id: 2 },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
