import api_perguntas from "../Models/Perguntas.js";

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
}

export default PerguntasController;
