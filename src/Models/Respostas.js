import { DataTypes } from "sequelize";
import sequelize from "../Config/Config.js";

import { api_perguntas } from "./index.js";

const api_respostas = sequelize.define("api_respostas", {
  id_user: { type: DataTypes.STRING },
  id_categoria: { type: DataTypes.INTEGER },
  nivel: { type: DataTypes.INTEGER },
  data: { type: DataTypes.STRING },
});

export default api_respostas;
