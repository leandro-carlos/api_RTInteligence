import sequelize from "../Config/Config.js";
import { Op } from "sequelize";
import { api_acaos } from "../Models/index.js";
import { api_acompanhamentos } from "../Models/index.js";
import { api_datas } from "../Models/index.js";
import { api_perguntas } from "../Models/index.js";
import { api_respostas } from "../Models/index.js";
import { api_graphcomparative } from "../Models/index.js";

class PerguntasController {
  static getAllQuestions = async (req, res) => {
    // retorna todas as perguntas e categorias
    try {
      return await api_perguntas
        .findAll()
        .then((data) => res.status(200).json(data));
    } catch (error) {
      res.send(error);
    }
  };

  static dates = async (req, res) => {
    const { id_user } = req.body;

    try {
      return await api_datas
        .findAll({ where: { id_user: id_user }, attributes: ["data", "id"] })
        .then((data) => res.status(200).send(data));
    } catch (error) {}
  };

  static dataToGraph = async (req, res) => {
    // Dados pro resultado (nota + categoria + cor da categoria)
    const { id, data } = req.body;
    let calculo = 0;

    const dataValues = [];

    api_respostas
      .findAll({
        where: { id_user: id, data: data },
        attributes: ["nivel"],
        raw: true,
        include: [
          {
            model: api_perguntas,
            attributes: ["categoria", "id_categoria", "cor"],
          },
        ],
      })
      .then((content) => {
        content.forEach((item) => {
          calculo += item.nivel;
          var className = {
            categoria: item["api_pergunta.categoria"],
            id_categoria: item["api_pergunta.id_categoria"],
            nivel: item.nivel,
            cor: item["api_pergunta.cor"],
          };
          dataValues.push(className);
        });
        res.json({ data: dataValues, calculo });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  static getActionAndFollow = async (req, res) => {
    // retorna resposta do açao e acompanhamento
    try {
      const { id_user, data } = req.body;

      const acompanhamento = await api_acompanhamentos.findAll({
        where: { id_user: id_user, data: data },
      });
      const acao = await api_acaos.findAll({
        where: { id_user: id_user, data: data },
      });

      const arrayTeste = [{ acompanhamento }, { acao }];
      res.status(200).send(arrayTeste);
    } catch (error) {
      res.status(500).send("Deu erro interno");
    }
  };

  static getComparative = async (req, res) => {
    // Gráfico comparativo
    const { id_user } = req.body;

    const eightMonthsAgo = new Date(new Date() - 8 * 30 * 24 * 60 * 60 * 1000); // Calculo pra 8 meses atrás

    api_graphcomparative
      .findAll({
        where: {
          id_user: id_user,
          createdAt: { [Op.gte]: eightMonthsAgo },
        },
        attributes: [
          "nota",
          "id",
          [
            sequelize.Sequelize.fn(
              "date_format",
              sequelize.Sequelize.col("createdAt"),
              "%m"
            ),
            "mesReferencia",
          ],
          [
            sequelize.Sequelize.fn(
              "date_format",
              sequelize.Sequelize.col("createdAt"),
              "%y"
            ),
            "anoReferencia",
          ],
        ],
      })
      .then((content) => res.status(200).send(content))
      .catch((error) => res.send(error));
  };
}

export default PerguntasController;
