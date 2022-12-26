import { DataTypes } from "sequelize";
import sequelize from "../Config/Config.js";

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

export default api_perguntas;
