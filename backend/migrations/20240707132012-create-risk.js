'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Risk', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      triggering_event_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Event',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
      risk_response: {
        type: Sequelize.ENUM('Decrease', 'Transfer', 'Accept'),
        allowNull: false
      },
      score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      response_strategy: {
        type: Sequelize.STRING,
        allowNull: false
      },
      expected_result: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      note: {
        type: Sequelize.STRING,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Project',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'RiskCategory',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
    await queryInterface.sequelize.query('ALTER TABLE "Risk" ADD CONSTRAINT chk_probability CHECK (probability >= 1 AND probability <= 5)');
    await queryInterface.sequelize.query('ALTER TABLE "Risk" ADD CONSTRAINT chk_impact CHECK (impact >= 1 AND impact <= 5)');
    await queryInterface.sequelize.query('ALTER TABLE "Risk" ADD CONSTRAINT chk_risk_response CHECK (risk_response IN (\'Decrease\', \'Transfer\', \'Accept\'))');

    // Create a function to update the score
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_score()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.score := NEW.probability * NEW.impact;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Create a trigger to call the function before insert or update
    await queryInterface.sequelize.query(`
      CREATE TRIGGER calculate_score
      BEFORE INSERT OR UPDATE ON "Risk"
      FOR EACH ROW
      EXECUTE PROCEDURE update_score();
    `);
  },
  async down(queryInterface, Sequelize) {
    // Drop the trigger and function first
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS calculate_score ON "Risk"');
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS update_score()');
    
    // Then drop the table
    await queryInterface.dropTable('Risk');
  }
};
