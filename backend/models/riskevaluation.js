'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RiskEvaluation extends Model {
    static associate(models) {
      RiskEvaluation.belongsTo(models.Risk, { foreignKey: 'risk_id', onDelete: 'CASCADE' });
      RiskEvaluation.belongsTo(models.Users, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    }
  }
  RiskEvaluation.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    risk_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Risk',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    evaluation_date: {
      type: DataTypes.DATE,
      allowNull: false
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
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    comments: {
      type: DataTypes.TEXT
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
    modelName: 'RiskEvaluation',
    tableName: 'RiskEvaluation',
    hooks: {
      beforeSave: (riskEvaluation, options) => {
        riskEvaluation.score = riskEvaluation.probability * riskEvaluation.impact;
      }
    }
  });
  return RiskEvaluation;
};
