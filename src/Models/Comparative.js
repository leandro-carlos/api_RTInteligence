import sequelize from "../Config/Config.js";
import { DataTypes } from "sequelize";

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

export default api_graphcomparative;
