'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MitigationAction extends Model {
    static associate(models) {
      MitigationAction.belongsTo(models.Risk, { foreignKey: 'risk_id', onDelete: 'CASCADE' });
      MitigationAction.belongsTo(models.Users, { foreignKey: 'assigned_to' });
    }
  }
  MitigationAction.init({
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
    action_description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    assigned_to: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    due_date: {
      type: DataTypes.DATE
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    completed_at: {
      type: DataTypes.DATE
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'MitigationAction',
    tableName: 'MitigationAction',
  });
  return MitigationAction;
};
