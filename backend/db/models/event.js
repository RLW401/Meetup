'use strict';
const { Model, Validator, Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.belongsTo(models.Group, {foreignKey: "groupId"});

      Event.belongsTo(models.Venue, {foreignKey: "venueId"});

      Event.hasMany(models.Image, {as: "EventImage", foreignKey: "eventId"});

      Event.belongsToMany(models.User, {through: models.Attendee});
      Event.hasMany(models.Attendee, {foreignKey: "eventId"});
    }
  }
  Event.init({
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    venueId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Event',
    defaultScope: {
      attributes: {
        exclude: [
          "description", "capacity", "price",
          "createdAt", "updatedAt"
        ]
      }
    },
    scopes: {
      eventDetail: {
        attributes: {
          exclude: ["createdAt", "updatedAt"]
        }
      }
    }
  });
  return Event;
};
