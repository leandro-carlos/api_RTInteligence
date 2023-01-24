import sequelize from "../Config/Config.js";
import { DataTypes } from "sequelize";

const api_graphcomparative = sequelize.define("api_graphcomparative", {
  id_user: { type: DataTypes.INTEGER },
  nota: { type: DataTypes.INTEGER },
  dataReferencia: { type: DataTypes.STRING },
  createdAt: {
    type: DataTypes.DATE,
  },
  updateAt: { type: DataTypes.DATE },
});

export default api_graphcomparative;
