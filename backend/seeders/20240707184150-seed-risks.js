'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Risk', [
      { description: 'Market Risk', triggering_event_id: 1, probability: 3, impact: 4, risk_response: 'Decrease', response_strategy: 'Hedge', expected_result: 'Reduced Exposure', status: 'Open', note: 'Monitor closely', user_id: 2, project_id: 1, category_id: 1, score: 12 },
      { description: 'Operational Risk', triggering_event_id: 2, probability: 2, impact: 5, risk_response: 'Transfer', response_strategy: 'Insurance', expected_result: 'No Loss', status: 'Open', note: 'Review insurance policy', user_id: 3, project_id: 2, category_id: 2, score: 10 },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Risk', null, {});
  }
};
