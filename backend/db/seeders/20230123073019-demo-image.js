'use strict';

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define schema in options object
}
options.tableName = "Images";

const imageURLs = [
  "https://res.cloudinary.com/dqswruico/image/upload/v1678298111/initial_meetup_seeder/Tennis_aqua_zone_elxpcl.jpg",
  "./images/north-pole",
  "./images/south-pole.jpg",
  "https://res.cloudinary.com/dqswruico/image/upload/v1678298110/initial_meetup_seeder/Group_X_image_fp5src.jpg",
  "https://res.cloudinary.com/dqswruico/image/upload/v1678298110/initial_meetup_seeder/Dog_Group_image_o4afwe.jpg"
]

const image1 = {
  groupId: 1,
  url: imageURLs[0],
  groupPreview: true,
  eventPreview: false
};
const image2 = {
  eventId: 2,
  url: imageURLs[1],
  groupPreview: false,
  eventPreview: true
};
const image3 = {
  eventId: 3,
  url: imageURLs[2],
  groupPreview: false,
  eventPreview: false
};
const image4 = {
  groupId: 3,
  eventId: 3,
  url: imageURLs[3],
  groupPreview: true,
  eventPreview: true
};
const image5 = {
  groupId: 2,
  url: imageURLs[4],
  groupPreview: true,
  eventPreview: false
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
    image1, image2, image3, image4, image5
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
      url: { [Op.in]: imageURLs }
    }, {});
  }
};
