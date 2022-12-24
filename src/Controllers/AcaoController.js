import sequelize from "../Config/Config.js";
import api_acaos from "../Models/Acao.js";
import api_acompanhamentos from "../Models/Acompanhamento.js";

class AcaoController {
  static answerActionAndFollowUp = async (req, res) => {
    const data = req.body;

    let bodyAcao = {
      id_user: data.id_user,
      name_categoria: data.acao.name_categoria,
      descricao_categoria: data.acao.descricao_categoria,
    };
    let bodyAcompanhamento = {
      id_user: data.id_user,
      quais_aprendizados: data.acompanhamento.quais_aprendizados,
      evolucao_conquista: data.acompanhamento.evolucao_conquista,
      melhorar: data.acompanhamento.melhorar,
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
}

export default AcaoController;
