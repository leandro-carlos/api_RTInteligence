const { DataTypes } = require("sequelize");
const sequelize = require("../Config/Config.js");

const api_respostas = sequelize.define("api_respostas", {
  id_user: { type: DataTypes.INTEGER },
  id_categoria: { type: DataTypes.INTEGER },
  nivel: { type: DataTypes.INTEGER },
  data: { type: DataTypes.STRING },
});

module.exports = api_respostas;
