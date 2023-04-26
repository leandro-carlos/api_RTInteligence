const sequelize = require("../Config/Config.js");

const api_acaos = require("./Acao.js");
const api_acompanhamentos = require("./Acompanhamento.js");
const api_datas = require("./datas.js");
const api_perguntas = require("./Perguntas.js");
const api_respostas = require("./Respostas.js");
const api_users = require("./User.js");
const api_graphcomparative = require("./Comparative.js");
const api_channels = require("./VideoCallChannels.js");
const api_reportCsv = require("./ReportCSV.js");

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

module.exports = {
  api_acaos,
  api_acompanhamentos,
  api_datas,
  api_perguntas,
  api_respostas,
  api_users,
  api_graphcomparative,
  api_channels,
  api_reportCsv,
};
