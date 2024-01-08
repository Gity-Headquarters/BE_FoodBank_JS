// models/Booth.js

"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Booth extends Model {
    static associate(models) {
      // Di sini Anda dapat menentukan asosiasi dengan model lain jika diperlukan
      // Contoh: Booth.hasMany(models.Food);
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
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
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
