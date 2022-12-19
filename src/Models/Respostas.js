import { DataTypes } from "sequelize";
import sequelize from "../Config/Config.js";

// import api_perguntas from "./Perguntas.js";
// import api_users from "./User.js";

const api_respostas = sequelize.define("api_respostas", {
  id_user: { type: DataTypes.STRING },
  id_pergunta: { type: DataTypes.STRING },
  nivel: { type: DataTypes.STRING },
  createdAt: { type: DataTypes.DATE },
  updatedAt: { type: DataTypes.DATE },
});

sequelize
  .sync()
  .then(() => {
    console.log("api_respostas table created suceel");
  })
  .catch((error) => console.error("Unable to create table : ", error));

export default api_respostas;
