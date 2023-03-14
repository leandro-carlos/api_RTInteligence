const sequelize = require("../Config/Config.js");
const { DataTypes } = require("sequelize");

const api_graphcomparative = sequelize.define("api_graphcomparative", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_user: { type: DataTypes.INTEGER },
  nota: { type: DataTypes.INTEGER },
  dataReferencia: { type: DataTypes.STRING },
});

module.exports = api_graphcomparative;
