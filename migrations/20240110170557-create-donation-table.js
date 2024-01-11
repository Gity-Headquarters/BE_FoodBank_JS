"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Membuat tabel Donations
    await queryInterface.createTable("Donations", {
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
      booth_id: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        references: {
          model: "Booths",
          key: "guid",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      user_id: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        references: {
          model: "Users",
          key: "guid",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      amount: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      code: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      payment_url: {
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

    // Menambahkan indeks untuk kolom booth_id pada tabel Donations
    await queryInterface.addIndex("Donations", ["booth_id"]);

    // Menambahkan indeks untuk kolom user_id pada tabel Donations
    await queryInterface.addIndex("Donations", ["user_id"]);

    // Menambahkan foreign key constraint pada kolom booth_id di tabel Donations
    await queryInterface.addConstraint("Donations", {
      fields: ["booth_id"],
      type: "foreign key",
      name: "fk_donations_booths", // Nama constraint
      references: {
        table: "Booths",
        field: "guid",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // Menambahkan foreign key constraint pada kolom user_id di tabel Donations
    await queryInterface.addConstraint("Donations", {
      fields: ["user_id"],
      type: "foreign key",
      name: "fk_donations_users", // Nama constraint
      references: {
        table: "Users",
        field: "guid",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    // Menghapus tabel Donations saat melakukan rollback migrasi
    await queryInterface.dropTable("Donations");
  },
};
