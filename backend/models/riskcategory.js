'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RiskCategory extends Model {
    static associate(models) {
      // Define associations here if necessary
    }
  }
  RiskCategory.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'RiskCategory',
    tableName: 'RiskCategory',
  });
  return RiskCategory;
};
