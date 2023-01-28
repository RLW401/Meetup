'use strict';
const { Model, Validator, Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Membership.belongsTo(models.User, {foreignKey: 'userId'});
      Membership.belongsTo(models.Group, {foreignKey: 'groupId'});
    }
  }
  Membership.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Membership',
    defaultScope: {
      attributes: {
        // exclude: ['userId', 'groupId', 'createdAt', 'updatedAt']
        exclude: ["createdAt", "updatedAt"]
      }
    },
    scopes: {
      membershipDetails: {
        attributes: {
          exclude: ["createdAt", "updatedAt"]
        }
      }
    },
    indexes: [{unique: true, fields: ["userId", "groupId"]}]
  });
  return Membership;
};
