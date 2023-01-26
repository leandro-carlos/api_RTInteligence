import sequelize from "../Config/Config.js";
import bcrypt from "bcrypt";

import {
  api_graphcomparative,
  api_acaos,
  api_respostas,
  api_users,
  api_datas,
  api_acompanhamentos,
} from "../Models/index.js";

class AdminController {
  static deleteUser = async (req, res) => {
    const { id } = req.body;

    sequelize
      .transaction(async (transaction) => {
        api_respostas.destroy({
          where: { id_user: id },
        });

        api_graphcomparative.destroy({
          where: { id_user: id },
        });

        api_datas.destroy({
          where: { id_user: id },
        });

        api_acaos.destroy({
          where: { id_user: id },
        });

        api_acompanhamentos.destroy({
          where: { id_user: id },
        });

        api_users.destroy({
          where: { id: id },
        });
      })
      .then((content) =>
        res
          .status(200)
          .send({ status: true, msg: "Dados excluído com sucesso!" })
      )
      .catch((err) => {
        res.status(400).send("Ocorreu erro interno, tente novamente!");
      });
  };

  static updateUser = async (req, res) => {
    const { id } = req.params;

    const { email, name, password } = req.body;

    let body = {};

    if (name) {
      body.name = name;
    }
    if (email) {
      body.email = email;
    }
    if (password) {
      body.password = await bcrypt.hash(password, 8);
    }

    api_users
      .update(body, {
        where: { id: id },
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
          "finalizou_acompanhamento",
        ],
      })
      .then((data) => res.status(200).json(data));
  };

  static restart = async (req, res) => {
    const { id, data } = req.body;
    var body = { finalizou: null, finalizou_acompanhamento: null };

    sequelize
      .transaction(async (transaction) => {
        api_users.update(body, { where: { id: id } });

        api_respostas.destroy({
          where: { id_user: id, data: data },
        });

        api_graphcomparative.destroy({
          where: { id_user: id, dataReferencia: data },
        });

        api_datas.destroy({
          where: { id_user: id, data: data },
        });

        api_acaos.destroy({
          where: { id_user: id, data: data },
        });

        api_acompanhamentos.destroy({
          where: { id_user: id, data: data },
        });
      })
      .then((content) =>
        res
          .status(200)
          .send({ status: true, msg: "Dados resetados com sucesso!" })
      )
      .catch((err) => {
        res.status(400).send("Ocorreu erro interno, tente novamente!");
      });
  };
}

export default AdminController;
