import { where } from "sequelize";

import { api_acaos } from "../Models/index.js";
import { api_acompanhamentos } from "../Models/index.js";
import { api_datas } from "../Models/index.js";
import { api_perguntas } from "../Models/index.js";
import { api_respostas } from "../Models/index.js";

class PerguntasController {
  static getAllQuestions = async (req, res) => {
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
        .findAll({ where: { id_user: id_user }, attributes: ["data"] })
        .then((data) => res.status(200).json(data));
    } catch (error) {}
  };

  static replyQuiz = async (req, res) => {
    const newdate = new Date();
    const data = `${newdate.getDate()}/${
      newdate.getMonth() + 1
    }/${newdate.getFullYear()}`;

    const { id_user } = req.body;

    api_datas
      .create({
        id_user: id_user,
        data: data,
      })
      .then(
        () =>
          req.body.resp.map(async (item) => {
            const body = {
              id_user: id_user,
              id_categoria: item.id_categoria,
              nivel: item.nivel,
              data: data,
            };

            api_respostas.create(body);
          }),
        res.status(200).send(true)
      );
  };

  static dataToGraph = async (req, res) => {
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
            attributes: ["categoria", "id_categoria"],
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
}

export default PerguntasController;
