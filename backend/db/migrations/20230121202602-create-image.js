'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Images', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      groupId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Groups",
          key: "id"
        },
        onDelete: "SET NULL"
      },
      eventId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Events",
          key: "id"
        },
        onDelete: "SET NULL"
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
        //unique: true
      },
      groupPreview: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      eventPreview: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      }
    }, options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Images";
    await queryInterface.dropTable(options);
  }
};
