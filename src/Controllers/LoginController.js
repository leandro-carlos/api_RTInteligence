import { json } from "express";
import api_users from "../Models/User.js";
import sequelize from "../Config/Config.js";

class LoginController {
  static handleLogin = (req, res) => {
    sequelize.sync().then((res) => res.send);
  };
}

export default LoginController;
