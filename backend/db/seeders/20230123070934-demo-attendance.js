'use strict';

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define schema in options object
}
options.tableName = "Attendances";

const validStatus = ["pending", "waitlist", "member", "co-host"];

const attendance1 = { userId: 1, eventId: 1, status: validStatus[2]};
const attendance2 = { userId: 2, eventId: 1, status: validStatus[1]};
const attendance3 = { userId: 3, eventId: 2, status: validStatus[3]};
const attendance4 = { userId: 3, eventId: 3, status: validStatus[2]};


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
      attendance1, attendance2, attendance3, attendance4
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
    const where = {
      // check on this syntax
      [Op.or]: [{
        [Op.and]: [{userId: 1, eventId: 1}],
        [Op.and]: [{userId: 2, eventId: 1}],
        [Op.and]: [{userId: 3, eventId: 2}],
        [Op.and]: [{userId: 3, eventId: 3}]
      }]
    };

    await queryInterface.bulkDelete(options, where, {});
  }
};
