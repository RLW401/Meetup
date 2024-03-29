'use strict';

const bcrypt = require("bcryptjs");
const seedUsernames = [
  'Demo-lition', 'FakeUser1', 'BobJohnson'
];

const seedFirstNames = ["Demo", "Fake", "Bob", "Stilton"];
const seedLastNames = ["Lition", "User1", "Johnson", "Cheesewright"];

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   options.tableName = "Users";
   await queryInterface.bulkInsert(options, [{
        email: 'demo@user.io',
        username: seedUsernames[0],
        firstName: seedFirstNames[3],
        lastName: seedLastNames[3],
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'user1@user.io',
        username: seedUsernames[1],
        firstName: seedFirstNames[1],
        lastName: seedLastNames[1],
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'bob@johnson.com',
        username: seedUsernames[2],
        firstName: seedFirstNames[2],
        lastName: seedLastNames[2],
        hashedPassword: bcrypt.hashSync('password')
      }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Users";
    const Op = Sequelize.Op;

    await queryInterface.bulkDelete(options, {
      username: { [Op.in]: seedUsernames }
    }, {});
  }
};
