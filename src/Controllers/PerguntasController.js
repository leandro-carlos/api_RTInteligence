import api_perguntas from "../Models/Perguntas.js";

// class PerguntasController {
//   const getAllPerguntas = async (req, res) => {
//     try {
//       return await api_perguntas
//         .findAll()
//         .then((data) => res.status(200).json(data));
//     } catch (error) {
//       res.status(200).json({
//         message: "falha" + error,
//       });
//     }
//   };
// }

const getAllPerguntas = async (req, res) => {
  api_perguntas.findAll().then((data) => {
    console.log("data", data);
    if (data[0] == null) {
      res.status(404).sendStatus(404);
    } else {
      res.status(200).json(data);
    }
  });
};

export default getAllPerguntas;
