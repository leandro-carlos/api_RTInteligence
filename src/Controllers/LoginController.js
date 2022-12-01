import json from "express";
import api_users from "../Models/User.js";
import sequelize from "../Config/Config.js";
import bcrypt from "bcrypt";

class LoginController {
  // faltando implementar algumas funcionalidades
  static login = async (req, res) => {
    const { email, password } = req.body;

    const emailExist = await api_users.findOne({ email: email });

    // const project = await Project.findOne({ where: { title: 'My Title' } });

    console.log(emailExist);

    const match = await bcrypt.compare(password, emailExist.password);

    if (emailExist && match) {
      return res.status(200).json({
        message: "bem vindo",
      });
    } else {
      return res.status(200).json({
        message: "deu erro",
      });
    }
  };

  // função teste
  static getAllUser = async (req, res) => {
    return await api_users.findAll().then((response) => res.json(response));
  };

  // pronta -> tratar erros só
  static register = async (req, res) => {
    const { nome, email, password } = req.body;

    const body = {
      name: nome,
      email: email,
      password: await bcrypt.hash(password, 8),
    };

    await api_users
      .create(body)
      .then(() => {
        return res.status(200).json({
          message: "usuario cadastrado com sucesso!!",
        });
      })
      .catch((err) => {
        return res.json({
          message: "Deu erro na requisição",
        });
      });
  };
}

export default LoginController;
