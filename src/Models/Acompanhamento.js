const { DataTypes } = require("sequelize");
const sequelize = require("../Config/Config.js");

const api_acompanhamentos = sequelize.define("api_acompanhamentos", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_user: { type: DataTypes.INTEGER },
  quais_aprendizados: { type: DataTypes.STRING },
  evolucao_conquista: { type: DataTypes.STRING },
  melhorar: { type: DataTypes.STRING },
  data: { type: DataTypes.STRING },
  createdAt: { type: DataTypes.TIME },
  updatedAt: { type: DataTypes.TIME },
});

module.exports = api_acompanhamentos;
