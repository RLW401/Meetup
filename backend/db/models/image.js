'use strict';
const { Model, Validator, Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Image.belongsTo(models.Group, {foreignKey: "groupId"});

      Image.belongsTo(models.Event, {foreignKey: "eventId"});
    }
  }
  Image.init({
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    groupPreview: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    eventPreview: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};
