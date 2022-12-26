import { DataTypes } from "sequelize";
import sequelize from "../Config/Config.js";

const api_datas = sequelize.define("api_datas", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_user: { type: DataTypes.INTEGER },
  data: { type: DataTypes.STRING },
});

export default api_datas;
