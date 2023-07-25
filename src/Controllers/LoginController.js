const api_users = require("../Models/User.js");
const bcrypt = require("bcrypt");

class LoginController {
  // pronta -> tratar erros só (quando)
  static login = async (req, res) => {
    const { email, password } = req.body;

    try {
      // Recupera o email digitado e busca no banco
      const emailExist = await api_users.findAll({ where: { email: email } });

      // pega a senha digita, encriptografa
      // e valida se é a mesma senha digitada no bd.

      const match = await bcrypt.compare(
        password,
        emailExist[0]?.dataValues.password
      );

      // Se ambos campos email e senha for true, efetua logi, se não da erro.

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

  static register = async (req, res) => {
    const { name, email, password } = req.body;

    const body = {
      name: name,
      email: email,
      password: await bcrypt.hash(password, 8),
    };

    //  Valida se o campo já existe no banco, se sim, retorna a msg
    // Se não, cria o usuario

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
        res.status(200).json({
          status: false,
          msg: "Email já cadastrado no banco de dados, tente outro.",
        });
      }
    });
  };

  // função pra retornar a versão do backend -> aplicativo

  static checkVersion = async (req, res) => {
    res.status(200).json({ version: "1.0.3" });
  };
}

module.exports = LoginController;
