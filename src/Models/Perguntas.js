import { Sequelize, Model, DataTypes } from "sequelize";
import sequelize from "../Config/Config.js";

import api_users from "./User.js";

const api_perguntas = sequelize.define("api_perguntas", {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  categoria: { type: DataTypes.STRING },
  pergunta: { type: DataTypes.STRING },
});

sequelize
  .sync()
  .then(() => {
    console.log("api_perguntas table created suceel");
  })
  .catch((error) => console.error("Unable to create table : ", error));

// api_perguntas.sync({ force: true });

export default api_perguntas;
