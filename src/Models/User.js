const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require("../Config/Config.js");

const api_users = sequelize.define("api_users", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  supervisor: { type: DataTypes.BOOLEAN, defaultValue: false },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING },
  password: { type: DataTypes.STRING },
  finalizou: { type: DataTypes.STRING, defaultValue: "" },
  finalizou_acompanhamento: { type: DataTypes.STRING, defaultValue: "" },
});

module.exports = api_users;
