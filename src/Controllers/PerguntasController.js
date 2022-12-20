import api_perguntas from "../Models/Perguntas.js";
import api_users from "../Models/User.js";
import api_respostas from "../Models/Respostas.js";

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

  static replyQuiz = async (req, res) => {
    req.body.map(async (item) => {
      const body = {
        id_user: item.id_user,
        id_pergunta: item.id_pergunta,
        nivel: item.nivel,
      };

      api_respostas.create(body).then(() => {
        res.status(200).send(true);
      });
    });
  };

  static calculoNivel = async (req, res) => {
    const { id } = req.body;
    let calculo = 0;

    api_respostas
      .findAll({ where: { id_user: id } })
      .then((content) => {
        content.forEach((item) => {
          calculo += parseInt(item.dataValues.nivel);
        });
        res.json({ calculo });
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export default PerguntasController;
