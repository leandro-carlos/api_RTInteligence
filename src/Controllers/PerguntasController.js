import api_perguntas from "../Models/Perguntas.js";
import api_users from "../Models/User.js";
import api_respostas from "../Models/Respostas.js";

class PerguntasController {
  static getAllPerguntas = async (req, res) => {
    try {
      return await api_perguntas
        .findAll()
        .then((data) => res.status(200).json(data));
    } catch (error) {
      res.status(200).json({
        message: "falha" + error,
      });
    }
  };

  static responderPerguntas = async (req, res) => {
    const { id_pergunta, nivel, id_user } = req.body;

    const body = {
      id_user: id_user,
      id_pergunta: id_pergunta,
      nivel: nivel,
    };

    console.log("pergunta", id_pergunta);
    console.log("pergunta", id_user);
    console.log("pergunta", nivel);

    await api_respostas
      .create(body)
      .then(() => {
        res.status(200).send("deu bom");
      })
      .catch((error) => res.status(406).send("deu errado" + error));
  };
}

export default PerguntasController;
