const { DataTypes } = require("sequelize");
const sequelize = require("../Config/Config.js");

const api_datas = sequelize.define("api_datas", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_user: { type: DataTypes.INTEGER },
  data: { type: DataTypes.STRING },
});

module.exports = api_datas;
