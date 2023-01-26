'use strict';
const { Model, Validator, Op } = require('sequelize');

const maxNameLen = 60;
const minAboutLen = 50;
const validTypes = ["Online", "In person"];

module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.belongsTo(models.User, {as: 'Organizer', foreignKey: 'organizerId'});
      Group.belongsToMany(models.User, {as: 'Members', through: models.Membership});

      Group.hasMany(models.Membership, {foreignKey: 'groupId'})

      Group.hasMany(models.Image, {as: 'GroupImages', foreignKey: 'groupId'});

      Group.hasMany(models.Event, {foreignKey: 'groupId'});

      Group.hasMany(models.Venue, {foreignKey: 'groupId'});
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { max: {
        args: maxNameLen,
        msg: `Name must be ${maxNameLen} characters or less`
      } }
    },
    about: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { min: {
        args: minAboutLen,
        msg: `About must be ${minAboutLen} characters or more`
      } }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isIn: {
        args: [validTypes],
        msg: `Type must be '${validTypes[0]}' or '${validTypes[1]}'`
      } }
    },
    // Need to add custom message for type error: "Private must be a boolean"
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {notNull: {msg: "City is required"}}
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {notNull: {msg: "State is required"}}
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
