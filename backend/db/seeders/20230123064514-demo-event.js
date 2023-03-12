'use strict';

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define schema in options object
}
options.tableName = "Events";

const eventNames = ["Tennis Group First Meet and Greet", "North Pole hangout", "South Pole Hangout", "Witch Burning", "Rat Party"];

const event1 = {
  "groupId": 1,
  // "venueId": 1,
  "name": "Not a cult",
  "description": "This is not a cult. This is not a cult. This is not a cult. This is not a cult. This is not a cult. This is not a cult. ",
  "type": "Online",
  "capacity": 10,
  "price": 18.50,
  "startDate": new Date("2024-09-19 20:00:00"),
  "endDate": new Date("2024-09-19 22:00:00")
};

const event2 = {
  "groupId": 3,
  "venueId": 2,
  "name": "North Pole hangout",
  "description": "First meet and greet event for the evening tennis on the water group! Join us online for happy times!",
  "type": "In person",
  "capacity": 999,
  "price": 19.50,
  "startDate": new Date("2024-10-19 20:00:00"),
  "endDate": new Date("2024-10-19 22:00:00")
};

const event3 = {
  "groupId": 3,
  "venueId": 3,
  "name": "South Pole Hangout",
  "description": "First meet and greet event for the evening tennis on the water group! Join us online for happy times!",
  "type": "In person",
  "capacity": 9001,
  "price": 3.50,
  "startDate": new Date("2024-12-19 20:00:00"),
  "endDate": new Date("3024-12-19 22:00:00")
};

const witchBurning = {
  "groupId": 4,
  "name": eventNames[3],
  "description": "These odious crones have bedevilled us with their foul plague for long enough!",
  "type": "In person",
  "capacity": 9001,
  "price": 0,
  "startDate": new Date("1350-11-19 19:00:00"),
  "endDate": new Date("1350-11-19 23:30:00")
};

const ratParty = {
  "groupId": 4,
  "name": eventNames[4],
  "description": "Come take a much deserved break from witch-hunting with a variety of fun rat related activities, including (but not limited to) rat catching, rat grooming, and Ratsketball.",
  "type": "In person",
  "capacity": 400,
  "price": 3.50,
  "startDate": new Date("1350-09-17 19:00:00"),
  "endDate": new Date("1350-09-18 02:30:00")
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
    event1, event2, event3, witchBurning, ratParty
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
