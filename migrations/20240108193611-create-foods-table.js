"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Foods", {
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
      jenis: {
        allowNull: false,
        type: Sequelize.ENUM(
          "sembako",
          "minuman",
          "makanan berat",
          "makanan ringan",
          "buah buahan",
          "kue dan roti"
        ),
      },
      jumlah: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      gambar: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      id_booth: {
        allowNull: false,
        type: Sequelize.UUID, // Ubah tipe data menjadi Sequelize.UUID
        references: {
          model: "Booths", // Nama model untuk asosiasi
          key: "guid", // Kolom referensi di model "Booths"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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

    // Tambahkan indeks untuk id_booth untuk meningkatkan performa query
    await queryInterface.addIndex("Foods", ["id_booth"]);
    await queryInterface.addIndex("Foods", ["guid"]);

    // Menambahkan foreign key constraint pada kolom id_booth di tabel Foods
    await queryInterface.addConstraint("Foods", {
      fields: ["id_booth"],
      type: "foreign key",
      name: "fk_foods_booths", // Nama constraint
      references: {
        table: "Booths",
        field: "guid",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop tabel "Foods" jika migrasi di-rollback
    await queryInterface.dropTable("Foods");
  },
};
