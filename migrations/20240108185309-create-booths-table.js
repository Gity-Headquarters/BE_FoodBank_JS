"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Booths", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      guid: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true, // Menambahkan unique constraint pada kolom name
        // Menambahkan indeks pada kolom name untuk performa pencarian yang lebih baik
        index: true,
      },
      address: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      image: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      food_total: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      time_open: {
        allowNull: false,
        type: Sequelize.TIME,
      },
      time_close: {
        allowNull: false,
        type: Sequelize.TIME,
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM("open", "empty food", "close"),
        defaultValue: "open",
      },
      info_booth: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      description: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      number_phone: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex("Booths", ["guid"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Booths");
  },
};
