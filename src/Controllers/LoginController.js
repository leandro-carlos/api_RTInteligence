import api_users from "../Models/User.js";
import bcrypt from "bcrypt";

class LoginController {
  // pronta -> tratar erros só (quando)
  static login = async (req, res) => {
    const { email, password } = req.body;

    // faltando corrigir, quando tem email ele da certinho, mas quando o email não existe no banco
    // ele retorna um array vazio, e com isso quebra a linha 17

    try {
      const emailExist = await api_users.findAll({ where: { email: email } });

      // retorna true ou false
      const match = await bcrypt.compare(
        password,
        emailExist[0]?.dataValues.password
      );

      if (emailExist && match) {
        delete emailExist[0].dataValues["updatedAt"];
        delete emailExist[0].dataValues["createdAt"];
        delete emailExist[0].dataValues["password"];
        return res.status(200).json(emailExist);
      } else {
        return res.status(404).json({
          message: "Email ou senhas incorretas",
        });
      }
    } catch (error) {
      res.status(422).send(false);
    }
  };

  // pronta -> tratar erros só
  static register = async (req, res) => {
    const { name, email, password } = req.body;

    const body = {
      name: name,
      email: email,
      password: await bcrypt.hash(password, 8),
    };

    await api_users.findOne({ where: { email: email } }).then((resposta) => {
      if (resposta == undefined) {
        api_users
          .create(body)
          .then((content) => {
            delete body["password"];
            return res.status(201).json({
              message: "usuario cadastrado com sucesso!!",
              data: body,
            });
          })
          .catch((err) => {
            return res.json({
              message: "Deu erro na requisição",
              err,
            });
          });
      } else {
        res.status(418).send("Email já existe no banco");
      }
    });
  };
}

export default LoginController;
