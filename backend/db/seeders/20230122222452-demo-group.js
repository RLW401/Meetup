'use strict';

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define schema in options object
}
options.tableName = "Groups";

const groupNames = ["Evening Tennis in the aqua-zone", "Dog Group", "Group X"]

const groupObj1 = {
  "organizerId": 1,
  "name": groupNames[0],
  "about": "Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
  "type": "In person",
  "private": true,
  "city": "New York",
  "state": "NY",
}

const groupObj2 = {
  "organizerId": 3,
  "name": groupNames[1],
  "about": "I like dogs. Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
  "type": "In person",
  "private": true,
  "city": "New York",
  "state": "NY",
}

const groupObj3 = {
  "organizerId": 3,
  // "organizerId": null,
  "name": groupNames[2],
  "about": `${groupNames[2]} Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.`,
  "type": "Online",
  "private": false,
  "city": "New York",
  "state": "NY",
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
   await queryInterface.bulkInsert(options, [
    groupObj1, groupObj2, groupObj3
  ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const Op = Sequelize.Op;

    await queryInterface.bulkDelete(options, {
      name: { [Op.in]: groupNames }
    }, {});
  }
};
