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
    await Promise.all(
      req.body.map(async (item) => {
        const body = {
          id_user: item.id_user,
          id_pergunta: item.id_pergunta,
          nivel: item.nivel,
        };

        try {
          return await api_respostas.create(body).then(() => {
            res.status(200).send(true);
          });
        } catch (error) {
          res.send(error);
        }
      })
    );
  };
}

export default PerguntasController;
