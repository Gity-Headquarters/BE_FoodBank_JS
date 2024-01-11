// models/Food.js

"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Food extends Model {
    static associate(models) {
      Food.belongsTo(models.Booth, { foreignKey: "id_booth" });
    }
  }
  Food.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      guid: {
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      jenis: {
        allowNull: false,
        type: DataTypes.ENUM(
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
        type: DataTypes.INTEGER,
      },
      image: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      id_booth: {
        allowNull: false,
        type: DataTypes.UUID,
        // Definisi foreign key yang merujuk ke tabel Booths
        references: {
          model: "Booths",
          key: "guid",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "created_at",
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "updated_at",
      },
    },
    {
      sequelize,
      modelName: "Food",
      tableName: "Foods",
    }
  );
  return Food;
};
