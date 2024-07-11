'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('RiskEvaluation', [
      { risk_id: 1, evaluation_date: new Date(), probability: 3, impact: 4, score: 12, user_id: 2, comments: 'Initial evaluation' },
      { risk_id: 2, evaluation_date: new Date(), probability: 2, impact: 5, score: 10, user_id: 3, comments: 'Follow-up evaluation' },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('RiskEvaluation', null, {});
  }
};
