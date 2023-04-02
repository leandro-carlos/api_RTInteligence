const { DataTypes } = require("sequelize");
const sequelize = require("../Config/Config.js");

const api_channels = sequelize.define("api_channels", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: "offline" },
  usersOnline: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
});

module.exports = api_channels;
