const { DataTypes } = require("sequelize");
const sequelize = require("../Config/Config.js");

const api_callHour = sequelize.define("api_channels", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_user_one: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null },
  id_user_two: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null },
});

module.exports = api_callHour;
