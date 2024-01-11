"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Donation extends Model {
    static associate(models) {
      Donation.belongsTo(models.Booth, { foreignKey: "booth_id" });
      Donation.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }
  Donation.init(
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
      booth_id: {
        allowNull: false,
        type: DataTypes.UUID,
      },
      user_id: {
        allowNull: false,
        type: DataTypes.UUID,
      },
      amount: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      status: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      code: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      payment_url: {
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
      modelName: "Donation",
      tableName: "Donations",
    }
  );
  return Donation;
};
