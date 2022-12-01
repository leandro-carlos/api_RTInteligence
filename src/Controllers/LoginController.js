import json from "express";
import api_users from "../Models/User.js";
import sequelize from "../Config/Config.js";
import bcrypt from "bcrypt";

class LoginController {
  // faltando implementar algumas funcionalidades
  static login = (req, res) => {
    const { email, password } = req.body;

    const passwordExist = bcrypt.compare(password, function (err, result) {
      result == true;
    });

    // return res.send(200).json(userExistEmail);
  };

  // função teste
  static handleLogin = async (req, res) => {
    return await api_users.findAll().then((response) => res.json(response));
  };

  // a fazer -> pendente
  static register = async (req, res) => {};
}

export default LoginController;
