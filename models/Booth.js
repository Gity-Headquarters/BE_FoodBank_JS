// models/Booth.js

"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Booth extends Model {
    static associate(models) {
      Booth.hasMany(models.Food, { foreignKey: "id_booth" });
      Booth.hasMany(models.Donation, { foreignKey: "booth_id" });
    }
  }
  Booth.init(
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
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
        // Menambahkan indeks pada kolom name untuk performa pencarian yang lebih baik
        indexes: true,
      },
      address: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      image: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      food_total: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      time_open: {
        allowNull: false,
        type: DataTypes.TIME,
      },
      time_close: {
        allowNull: false,
        type: DataTypes.TIME,
      },
      status: {
        allowNull: false,
        type: DataTypes.ENUM("open", "empty food", "close"),
        defaultValue: "open",
      },
      info_booth: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
      description: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
      number_phone: {
        allowNull: true,
        type: DataTypes.STRING,
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
      modelName: "Booth",
      tableName: "Booths",
    }
  );
  return Booth;
};
