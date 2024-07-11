'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Risk extends Model {
    static associate(models) {
      Risk.belongsTo(models.Users, { foreignKey: 'user_id' });
      Risk.belongsTo(models.Project, { foreignKey: 'project_id' });
      Risk.belongsTo(models.RiskCategory, { foreignKey: 'category_id' });
      Risk.belongsTo(models.Event, { foreignKey: 'triggering_event_id' });
      Risk.hasMany(models.Attachment, { foreignKey: 'risk_id' });  
      Risk.hasMany(models.MitigationAction, { foreignKey: 'risk_id' });
      Risk.hasMany(models.RiskEvaluation, { foreignKey: 'risk_id' });
    }
  }
  Risk.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    triggering_event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Event',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    probability: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    impact: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    risk_response: {
      type: DataTypes.ENUM('Decrease', 'Transfer', 'Accept'),
      allowNull: false
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    response_strategy: {
      type: DataTypes.STRING,
      allowNull: false
    },
    expected_result: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    note: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Project',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'RiskCategory',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Risk',
    tableName: 'Risk',
    hooks: {
      beforeSave: (risk, options) => {
        risk.score = risk.probability * risk.impact;
      }
    }
  });
  return Risk;
};
