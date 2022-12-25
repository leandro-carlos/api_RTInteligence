import { DataTypes } from "sequelize";
import sequelize from "../Config/Config.js";

const api_acaos = sequelize.define("api_acaos", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_user: { type: DataTypes.INTEGER },
  name_categoria: { type: DataTypes.STRING },
  descricao_categoria: { type: DataTypes.STRING },
  data: { type: DataTypes.STRING },
  createdAt: { type: DataTypes.TIME },
  updatedAt: { type: DataTypes.TIME },
});

export default api_acaos;
