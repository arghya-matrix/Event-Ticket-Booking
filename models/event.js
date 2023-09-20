const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../db/database");
const moment = require("moment");


const event = sequelize.define(
  "Event",
  {
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    },
    event_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    event_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM(["private", "public"]),
      allowNull: true,
      defaultValue: "private",
    },
    last_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    max_people: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    max_booking_per_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
  },
  {
    updatedAt: true,
  }
);

module.exports = event;
