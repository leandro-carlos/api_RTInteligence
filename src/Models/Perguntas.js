const { DataTypes } = require("sequelize");
const sequelize = require("../Config/Config.js");

const api_perguntas = sequelize.define("api_perguntas", {
  id_categoria: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  categoria: { type: DataTypes.STRING },
  pergunta: { type: DataTypes.STRING },
  cor: { type: DataTypes.STRING },
});

module.exports = api_perguntas;
