'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RiskEvaluation', {
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
      evaluation_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      probability: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5
        }
      },
      impact: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5
        }
      },
      score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      comments: {
        type: Sequelize.TEXT
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

    // Add CHECK constraints
    await queryInterface.sequelize.query('ALTER TABLE "RiskEvaluation" ADD CONSTRAINT chk_probability CHECK (probability >= 1 AND probability <= 5)');
    await queryInterface.sequelize.query('ALTER TABLE "RiskEvaluation" ADD CONSTRAINT chk_impact CHECK (impact >= 1 AND impact <= 5)');

    // Create a function to update the score
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_riskevaluation_score()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.score := NEW.probability * NEW.impact;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Create a trigger to call the function before insert or update
    await queryInterface.sequelize.query(`
      CREATE TRIGGER calculate_riskevaluation_score
      BEFORE INSERT OR UPDATE ON "RiskEvaluation"
      FOR EACH ROW
      EXECUTE PROCEDURE update_riskevaluation_score();
    `);
  },
  async down(queryInterface, Sequelize) {
    // Drop the trigger and function first
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS calculate_riskevaluation_score ON "RiskEvaluation"');
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS update_riskevaluation_score()');
    
    // Then drop the table
    await queryInterface.dropTable('RiskEvaluation');
  }
};
