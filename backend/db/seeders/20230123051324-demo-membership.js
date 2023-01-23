'use strict';

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define schema in options object
}
options.tableName = "Memberships";

const validStatus = ["pending", "waitlist", "member", "co-host"];

const membership1 = { groupId: 1, userId: 1, status: validStatus[3]}
const membership2 = { groupId: 1, userId: 2, status: validStatus[1]}
const membership3 = { groupId: 3, userId: 3, status: validStatus[3]}


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
      membership1, membership2, membership3
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
      [Op.or]: {
        [Op.and]: [{groupId: 1, userId: 1}],
        [Op.and]: [{groupId: 1, userId: 2}],
        [Op.and]: [{groupId: 3, userId: 3}]
      }
    }, {});
  }
};
