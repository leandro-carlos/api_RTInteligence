import sequelize from "../Config/Config.js";

import api_acaos from "./Acao.js";
import api_acompanhamentos from "./Acompanhamento.js";
import api_datas from "./datas.js";
import api_perguntas from "./Perguntas.js";
import api_respostas from "./Respostas.js";
import api_users from "./User.js";

api_respostas.belongsTo(api_perguntas, {
  foreignKey: "id_categoria",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

sequelize
  .sync()
  .then(() => {
    console.log("tables created suceel");
  })
  .catch((error) => console.error("Unable to create table : ", error));

export {
  api_acaos,
  api_acompanhamentos,
  api_datas,
  api_perguntas,
  api_respostas,
  api_users,
};
