import sequelize from "../Config/Config.js";
import { api_acompanhamentos, api_acaos, api_users } from "../Models/index.js";
import helpeData from "../helpers/helperDayFunction.js";

class AcaoController {
  static answerAction = async (req, res) => {
    const data = req.body;
    const newdate = new Date();

    let bodyAcao = {
      id_user: data.id_user,
      name_categoria: data.name_categoria,
      descricao_categoria: data.descricao_categoria,
      data: helpeData(newdate),
    };

    const dateMonthYear = `${newdate.getMonth() + 1}/${newdate.getFullYear()}`;

    api_users
      .findOne({ where: { id: data.id_user }, attributes: ["finalizou"] })
      .then((item) => {
        if (item.dataValues.finalizou == dateMonthYear) {
          res.status(200).json({
            status: false,
            msg: "Você já respondeu o ação e o quiz esse mês, tente novamente no próximo.",
          });
        } else {
          sequelize
            .transaction(async (transaction) => {
              api_acaos.create(bodyAcao);
              api_users.update(
                { finalizou: dateMonthYear },
                { where: { id: data.id_user } }
              );
            })
            .then((content) =>
              res
                .status(200)
                .json({ status: true, msg: "Dados inseridos com sucesso!" })
            )
            .catch((err) => {
              res.status(400).json({
                status: false,
                msg: "Ocorreu erro interno, tente novamente!",
              });
            });
        }
      });
  };

  static answerFollower = async (req, res) => {
    const data = req.body;

    const newdate = new Date();

    const dateMonthYear = `${newdate.getMonth() + 1}/${newdate.getFullYear()}`;

    let bodyAcompanhamento = {
      id_user: data.id_user,
      quais_aprendizados: data.quais_aprendizados,
      evolucao_conquista: data.evolucao_conquista,
      melhorar: data.melhorar,
      data: data.data,
    };

    api_users
      .findOne({
        where: { id: data.id_user },
        attributes: ["finalizou_acompanhamento"],
      })
      .then((item) => {
        sequelize
          .transaction(async (transaction) => {
            api_acompanhamentos.create(bodyAcompanhamento);
            api_users.update(
              { finalizou_acompanhamento: dateMonthYear },
              { where: { id: data.id_user } }
            );
          })
          .then((content) =>
            res
              .status(200)
              .json({ status: true, msg: "Dados inseridos com sucesso!" })
          )
          .catch((err) => {
            res.status(400).json({
              status: false,
              msg: "Ocorreu erro interno, tente novamente!",
            });
          });
      });
  };
}

export default AcaoController;
