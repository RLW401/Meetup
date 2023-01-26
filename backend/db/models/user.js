'use strict';
const { Model, Validator, Op } = require('sequelize');

const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    toSafeObject() {
      const { id, username, email, firstName, lastName } = this; // context will be User instance
      const safeObject = { id, username, email, firstName, lastName };
      return safeObject;
    }

    validatePassword(password) {
      const passwordValid = bcrypt.compareSync(password,
        this.hashedPassword.toString());
        return passwordValid;
    }

    static getCurrentUserById(id) {
      const currentUser = User.scope('currentUser').findByPk(id);
      return currentUser;
    }

    static async login({ credential, password }) {
      let passwordValid;
      const user = await User.scope('loginUser').findOne({
        where: {
          [Op.or]: {username: credential, email: credential}
        }
      });
      if (user) {
        passwordValid = user.validatePassword(password);
      }

      if (user && passwordValid) {
        const currentUser = await User.scope('currentUser').findByPk(user.id);
        return currentUser;
      }
    }

    static async signup({ username, email, password, firstName, lastName }) {
      const hashedPassword = bcrypt.hashSync(password);
      const newUser = await User.create({
        username,
        email,
        hashedPassword,
        firstName,
        lastName
      });
      const currentUser = await User.scope('currentUser').findByPk(newUser.id);
      return currentUser;
    }
    static associate(models) {
      // define association here
      User.hasMany(models.Group, {as: 'organizedGroups', foreignKey: 'organizerId'});

      User.belongsToMany(models.Group, {as: 'joinedGroups', through: models.Membership});
      User.hasMany(models.Membership, {foreignKey: 'userId'});

      User.belongsToMany(models.Event, {through: models.Attendance});
      User.hasMany(models.Attendance, {foreignKey: 'userId'});
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4, 30],
        isNotEmail(value) {
          if (Validator.isEmail(value)) {
            throw new Error("Cannot be an email.");
          }
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 255],
        isEmail: true
      }
    },
    hashedPassword: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [60, 60] }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [1, 32] }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [1, 32] }
    }
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: [
          "hashedPassword", "email", /*"username",*/
          "createdAt", "updatedAt"
        ]
      }
    },
    scopes: {
      currentUser: {
        attributes: { exclude: ["hashedPassword", /*"username",*/ "createdAt", "updatedAt"] }
      },
      loginUser: { attributes: {} }
    }
  });
  return User;
};
