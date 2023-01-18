import api_users from "../Models/User.js";
import bcrypt from "bcrypt";

class AdminController {
  static deleteUser = async (req, res) => {
    const { id } = req.body;

    api_users
      .destroy({
        where: { id: id },
        force: true,
      })
      .then((content) => {
        res
          .status(200)
          .send({ status: true, msg: "Usuario excluido com sucesso" });
      })
      .catch((err) => {
        res.send({ status: false, msg: "Deu erro" });
      });
  };

  static updateUser = async (req, res) => {
    const { id } = req.params;

    const { email, name, password } = req.body;

    const body = {
      name: name,
      email: email,
      password: await bcrypt.hash(password, 8),
    };

    api_users
      .update(body, {
        where: { id: id },
        WW,
      })
      .then((content) => {
        res.status(200).json({
          status: true,
          msg: "Usuario atualizado com sucesso",
        });
      })
      .catch(() => res.send({ status: false, msg: "Deu erro" }));
  };

  static getAllUsers = async (req, res) => {
    api_users
      .findAll({
        attributes: [
          "id",
          "supervisor",
          "name",
          "email",
          "password",
          "finalizou",
        ],
      })
      .then((data) => res.status(200).json(data));
  };
}

export default AdminController;
