const { DataTypes } = require("sequelize");
const sequelize = require("../Config/Config.js");
const { api_acompanhamentos } = require("./index.js");

const api_acaos = sequelize.define("api_acaos", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_user: {
    type: DataTypes.INTEGER,
  },
  name_categoria: { type: DataTypes.STRING },
  descricao_categoria: { type: DataTypes.STRING },
  data: { type: DataTypes.STRING },
  createdAt: { type: DataTypes.TIME },
  updatedAt: { type: DataTypes.TIME },
});

module.exports = api_acaos;
