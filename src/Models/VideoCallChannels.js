const { DataTypes } = require("sequelize");
const sequelize = require("../Config/Config.js");

const api_channels = sequelize.define("api_channels", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  usersOnline: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  id_user_one: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null },
  id_user_two: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null },
  id_user_three: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
  },
});

module.exports = api_channels;
