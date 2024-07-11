'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attachment extends Model {
    static associate(models) {
      Attachment.belongsTo(models.Risk, { foreignKey: 'risk_id', onDelete: 'CASCADE' });
    }
  }
  Attachment.init({
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
    file_path: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Attachment',
    tableName: 'Attachment',
  });
  return Attachment;
};
