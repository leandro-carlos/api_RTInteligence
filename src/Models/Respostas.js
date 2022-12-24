import { DataTypes } from "sequelize";
import sequelize from "../Config/Config.js";

import api_perguntas from "./Perguntas.js";

const api_respostas = sequelize.define("api_respostas", {
  id_user: { type: DataTypes.STRING },
  id_categoria: { type: DataTypes.INTEGER },
  nivel: { type: DataTypes.INTEGER },
  data: { type: DataTypes.STRING },
});

api_respostas.belongsTo(api_perguntas, {
  foreignKey: "id_categoria",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export default api_respostas;
