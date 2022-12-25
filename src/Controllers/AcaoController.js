import sequelize from "../Config/Config.js";
import api_acaos from "../Models/Acao.js";
import api_acompanhamentos from "../Models/Acompanhamento.js";

class AcaoController {
  static answerActionAndFollowUp = async (req, res) => {
    const data = req.body;
    const newdate = new Date();
    const date = `${newdate.getDate()}/${
      newdate.getMonth() + 1
    }/${newdate.getFullYear()}`;

    let bodyAcao = {
      id_user: data.id_user,
      name_categoria: data.acao.name_categoria,
      descricao_categoria: data.acao.descricao_categoria,
      data: date,
    };
    let bodyAcompanhamento = {
      id_user: data.id_user,
      quais_aprendizados: data.acompanhamento.quais_aprendizados,
      evolucao_conquista: data.acompanhamento.evolucao_conquista,
      melhorar: data.acompanhamento.melhorar,
      data: date,
    };

    sequelize
      .transaction(async (transaction) => {
        api_acompanhamentos.create(bodyAcompanhamento);
        api_acaos.create(bodyAcao);
      })
      .then((content) => res.status(200).send(true))
      .catch((err) => {
        res.status(400).send("Ocorreu erro interno, tente novamente!");
      });
  };

  // static getActionAndFollowUp = async (req, res) => {
  //   try {
  //     const { id_user, data } = req.body;
  //     let acao = {};
  //     let acompanhamento = {};
  //     api_acaos
  //       .findAll({
  //         where: { id_user: id_user, data: data },
  //       })
  //       .then((data) => (acao = data));
  //     api_acompanhamentos
  //       .findAll({ where: { id_user: id_user, data: data } })
  //       .then((data) => (acompanhamento = data));

  //     return res.status(200).json(acao, acompanhamento);
  //   } catch (error) {}
  // };
}

export default AcaoController;
