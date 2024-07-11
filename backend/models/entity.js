'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Entity extends Model {
    static associate(models) {
      Entity.belongsTo(models.Entity, { foreignKey: 'parent_id', as: 'parent' });
      Entity.hasMany(models.Entity, { foreignKey: 'parent_id', as: 'children' });
    }
  }
  Entity.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    parent_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Entity',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('Division', 'Service'),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Entity',
    tableName: 'Entity',
  });
  return Entity;
};
