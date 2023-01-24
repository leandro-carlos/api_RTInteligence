import api_users from "../Models/User.js";
import bcrypt from "bcrypt";

class LoginController {
  // pronta -> tratar erros só (quando)
  static login = async (req, res) => {
    const { email, password } = req.body;

    try {
      const emailExist = await api_users.findAll({ where: { email: email } });

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

  static checkVersion = async (req, res) => {
    res.status(200).json({ version: 1.0 });
  };
}

export default LoginController;
