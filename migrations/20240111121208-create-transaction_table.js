"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Membuat tabel Transactions
    await queryInterface.createTable("Transactions", {
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
      total_food: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      status: {
        allowNull: false,
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

    // Menambahkan indeks untuk kolom booth_id pada tabel Transactions
    await queryInterface.addIndex("Transactions", ["booth_id"]);

    // Menambahkan indeks untuk kolom user_id pada tabel Transactions
    await queryInterface.addIndex("Transactions", ["user_id"]);

    // Menambahkan foreign key constraint pada kolom booth_id di tabel Transactions
    await queryInterface.addConstraint("Transactions", {
      fields: ["booth_id"],
      type: "foreign key",
      name: "fk_Transactions_booths", // Nama constraint
      references: {
        table: "Booths",
        field: "guid",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // Menambahkan foreign key constraint pada kolom user_id di tabel Transactions
    await queryInterface.addConstraint("Transactions", {
      fields: ["user_id"],
      type: "foreign key",
      name: "fk_Transactions_users", // Nama constraint
      references: {
        table: "Users",
        field: "guid",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    // Menghapus tabel Transactions saat melakukan rollback migrasi
    await queryInterface.dropTable("Transactions");
  },
};
