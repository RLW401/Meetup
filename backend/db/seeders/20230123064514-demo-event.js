'use strict';

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define schema in options object
}
options.tableName = "Events";

const eventNames = ["Tennis Group First Meet and Greet", "North Pole hangout", "South Pole Hangout"];

const event1 = {
  "groupId": 1,
  "venueId": 1,
  "name": "Tennis Group First Meet and Greet",
  "description": "First meet and greet event for the evening tennis on the water group! Join us online for happy times!",
  "type": "Online",
  "capacity": 10,
  "price": 18.50,
  "startDate": "2021-11-19 20:00:00",
  "endDate": "2021-11-19 22:00:00"
};

const event2 = {
  "groupId": 3,
  "venueId": 2,
  "name": "North Pole hangout",
  "description": "First meet and greet event for the evening tennis on the water group! Join us online for happy times!",
  "type": "In person",
  "capacity": 999,
  "price": 19.50,
  "startDate": "2022-11-19 20:00:00",
  "endDate": "2022-11-19 22:00:00"
};

const event3 = {
  "groupId": 3,
  "venueId": 3,
  "name": "South Pole Hangout",
  "description": "First meet and greet event for the evening tennis on the water group! Join us online for happy times!",
  "type": "In person",
  "capacity": 9001,
  "price": 3.50,
  "startDate": "2023-11-19 20:00:00",
  "endDate": "3023-11-19 22:00:00"
};


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
    event1, event2, event3
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
      name: { [Op.in]: eventNames }
      }, {});
  }
};
