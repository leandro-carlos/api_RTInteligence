import sequelize from "../Config/Config.js";
import {
  api_acompanhamentos,
  api_acaos,
  api_users,
  api_datas,
  api_respostas,
  api_graphcomparative,
} from "../Models/index.js";
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

  static replyQuiz = async (req, res) => {
    const newdate = new Date();

    const data = helpeData(newdate);

    const { id_user } = req.body;

    let nota = 0;

    api_datas
      .create({
        id_user: id_user,
        data: data,
      })
      .then(() => {
        req.body.resp.map(async (item) => {
          const body = {
            id_user: id_user,
            id_categoria: item.id_categoria,
            nivel: item.nivel,
            data: data,
          };

          nota += item.nivel;
          api_respostas.create(body);
        });

        api_graphcomparative
          .create({ id_user: id_user, nota: nota, dataReferencia: data })
          .then(() => res.status(200).send(true));
      });
  };

  static teste = async (req, res) => {
    const newData = new Date();
    const data = helpeData(newData);
    const dateMonthYear = `${newData.getMonth() + 1}/${newData.getFullYear()}`;

    const { id, name_categoria, descricao_categoria } = req.body;

    let nota = 0;
    let bodyArray = [];

    let bodyAcao = {
      id_user: id,
      name_categoria: name_categoria,
      descricao_categoria: descricao_categoria,
      data: helpeData(newData),
    };

    req.body.resp.map(async (item) => {
      const body = {
        id_user: id,
        id_categoria: item.id_categoria,
        nivel: item.nivel,
        data: data,
      };
      nota += item.nivel;
      bodyArray.push(body);
    });

    // Valida se o usuario já respondeu o quiz/acao aquele mes, e faz a regra.
    api_users
      .findAll({ where: { id }, attributes: ["finalizou"] })
      .then((content) => {
        if (content[0].dataValues.finalizou == dateMonthYear) {
          res.status(200).json({
            status: false,
            msg: "Você já respondeu esse mês, tente novamente próximo mês.",
          });
        } else {
          sequelize
            .transaction(async (transaction) => {
              api_datas.create({ id_user: id, data: data });
              api_respostas.bulkCreate(bodyArray);
              api_acaos.create(bodyAcao);
              api_graphcomparative.create({
                id_user: id,
                nota: nota,
                dataReferencia: data,
              });
              api_users.update(
                { finalizou: dateMonthYear },
                { where: { id: id } }
              );
            })
            .then((item) =>
              res.status(200).json({
                status: true,
                msg: "Dados inseridos com sucesso!",
              })
            )
            .catch((error) => {
              console.log("erro no responder quiz/acao");
              res.status(409).json({
                status: false,
                msg: "Aconteceu um erro interno no servidor, tente novamente em alguns minutos.",
              });
            });
        }
      });
  };
}

export default AcaoController;
