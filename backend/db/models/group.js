'use strict';
const { Model, Validator, Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id"
      },
      onDelete: "CASCADE"
    },
    name: {type: DataTypes.STRING},
    about: {type: DataTypes.STRING},
    type: {type: DataTypes.STRING},
    private: {type: DataTypes.BOOLEAN},
    city: {type: DataTypes.STRING},
    state: {type: DataTypes.STRING}
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
