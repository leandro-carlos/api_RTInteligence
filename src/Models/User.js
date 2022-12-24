import { Sequelize, Model, DataTypes } from "sequelize";
import sequelize from "../Config/Config.js";

const api_users = sequelize.define("api_users", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  password: { type: DataTypes.STRING },
  // createdAt: { type: DataTypes.DATE },
  // updatedAt: { type: DataTypes.DATE },
});

export default api_users;
