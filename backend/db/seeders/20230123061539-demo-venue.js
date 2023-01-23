'use strict';

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define schema in options object
}
options.tableName = "Venues";

const venueAddresses = ["123 Disney Lane", "1 North Pole", "0 South Pole"]

const venue1 =     {
  "groupId": 1,
  "address": venueAddresses[0],
  "city": "New York",
  "state": "NY",
  "lat": 37.7645358,
  "lng": -122.4730327,
}

const venue2 =     {
  "groupId": 2,
  "address": venueAddresses[1],
  "city": "North Pole",
  "state": "NP",
  "lat": 90,
  "lng": 0,
}

const venue3 =     {
  "groupId": 3,
  "address": venueAddresses[2],
  "city": "South Pole",
  "state": "SP",
  "lat": -90,
  "lng": 0,
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
    venue1, venue2, venue3
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
      address: { [Op.in]: venueAddresses }
      }, {});
  }
};
