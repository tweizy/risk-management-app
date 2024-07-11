'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Entity', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      parent_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Entity',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('Division', 'Service'),
        allowNull: false
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

    // Add CHECK constraint
    await queryInterface.sequelize.query('ALTER TABLE "Entity" ADD CONSTRAINT chk_entity_type CHECK (type IN (\'Division\', \'Service\'))');
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Entity');
  }
};
