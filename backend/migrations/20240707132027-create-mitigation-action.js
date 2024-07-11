'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MitigationAction', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      risk_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Risk',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      action_description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      assigned_to: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      due_date: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      completed_at: {
        type: Sequelize.DATE
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('MitigationAction');
  }
};
