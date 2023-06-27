const { DataTypes } = require("sequelize");
const sequelize = require("../Config/Config.js");

const api_hoursControlls = sequelize.define("api_hoursControlls", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  hourStart: { type: DataTypes.STRING },
  minuteStart: { type: DataTypes.STRING },
  hourEnd: { type: DataTypes.STRING },
  minuteEnd: { type: DataTypes.STRING },
});

module.exports = api_hoursControlls;
