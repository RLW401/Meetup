// 'use strict';

// let options = {};
// if (process.env.NODE_ENV === "production") {
//   options.schema = process.env.SCHEMA; // define schema in options object
// }
// options.tableName = "Attendees";

// const validStatus = ["pending", "waitlist", "member", "co-host"];

// const attendee1 = { userId: 1, eventId: 1, status: validStatus[2]};
// const attendee2 = { userId: 2, eventId: 1, status: validStatus[1]};
// const attendee3 = { userId: 3, eventId: 2, status: validStatus[2]};
// const attendee4 = { userId: 3, eventId: 3, status: validStatus[3]};


// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up (queryInterface, Sequelize) {
//     /**
//      * Add seed commands here.
//      *
//      * Example:
//      * await queryInterface.bulkInsert('People', [{
//      *   name: 'John Doe',
//      *   isBetaMember: false
//      * }], {});
//     */
//     await queryInterface.bulkInsert(options, [
//       attendee1, attendee2, attendee3, attendee4
//     ], {});
//   },

//   async down (queryInterface, Sequelize) {
//     /**
//      * Add commands to revert seed here.
//      *
//      * Example:
//      * await queryInterface.bulkDelete('People', null, {});
//      */
//     const Op = Sequelize.Op;
//     const where = {
//       // check on this syntax
//       [Op.or]: [{
//         [Op.and]: [{userId: 1, eventId: 1}],
//         [Op.and]: [{userId: 2, eventId: 1}],
//         [Op.and]: [{userId: 3, eventId: 2}],
//         [Op.and]: [{userId: 3, eventId: 3}]
//       }]
//     };

//     await queryInterface.bulkDelete(options, where, {});
//   }
// };
