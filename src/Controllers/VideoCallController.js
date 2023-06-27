const { email } = require("../Config/Email.js");
const { api_reportCsv, api_channels } = require("../Models/index.js");
const fs = require("fs");
const { createTransport } = require("nodemailer");
const XLSX = require("xlsx");
const readXlsxFile = require("read-excel-file");
const fetch = require("node-fetch");
const { format } = require("date-fns");
const moment = require("moment/moment.js");
const { Op } = require("sequelize");

const cron = require("node-cron");

class VideoCallController {
  static EnterThreeUsersInCall = async (req, res) => {
    const body = {
      id_user: req.body.id_user,
      roomName: req.body.roomName,
      name: req.body.name,
      email: req.body.email,
      data: new Date(),
      hourEnter: new Date().getHours() + ":" + new Date().getMinutes(),
    };

    await api_reportCsv
      .create(body)
      .then((data) => {
        res.json({ status: true, data: data });
      })
      .catch((err) => {
        res.send(err.response);
      });
  };

  static ExitUser = async (req, res) => {
    await api_reportCsv
      .update(
        {
          hourExit: new Date().getHours() + ":" + new Date().getMinutes(),
        },
        {
          where: {
            id_user: req.body.id_user,
            roomName: req.body.roomName,
            // data: req.body.data,
          },
        }
      )
      .then((data) => {
        res.json({ status: true, data: data.dataValues });
      })
      .catch((err) => {
        res.status(404).json({
          status: false,
          message: "Não encontramos registro no banco, tente novamente.",
        });
      });
  };

  static sendDailyEmail = async (req, res) => {
    cron.schedule(
      "30 10 * * *",
      async () => {
        this.SendEmail();
      },
      {
        scheduled: true,
        timezone: "America/Sao_Paulo",
      }
    );

    res
      .status(200)
      .json({ message: "Agendamento do email realizado com sucesso!" });
  };

  static SendEmail = async (req, res) => {
    const transporter = createTransport(email);

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000); // Obtém a data e hora de 24 horas atrás

    try {
      const data = await api_reportCsv.findAll({
        where: {
          createdAt: {
            [Op.gte]: twentyFourHoursAgo,
          },
        },
      });

      const arrayNew = [];

      data.forEach((element) => {
        arrayNew.push({
          nome: element.dataValues.name,
          email: element.dataValues.email,
          "Hora de entrada": element.dataValues.hourEnter,
          "Hora de saída":
            element.dataValues.hourExit === null
              ? "Não informado"
              : element.dataValues.hourExit,
          Sala: element.dataValues.roomName,
          "Data da Call": moment(element.dataValues.data).format("DD/MM/YYYY"),
          // "Tempo de duração": Math.floor(
          //   Math.abs(element.dataValues.hourExit - element.dataValues.hourEnter)
          // ),
        });
      });

      const worksheet = XLSX.utils.json_to_sheet(arrayNew);
      const aoa = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      aoa[0].forEach((_, columnIndex) => {
        const maxLength = aoa.reduce((max, row) => {
          const cellValue = row[columnIndex] || "";
          return Math.max(max, cellValue.toString().length);
        }, 0);

        worksheet["cols"] = [{ wch: maxLength + 10, wpx: 100 }];
      });

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");

      XLSX.writeFile(workbook, "reports.xlsx", { compression: true });

      const currentData = format(new Date(), "dd/MM/yyyy");

      const mailOptions = {
        from: email.auth.user,
        to: "leandro.carlosleo2015@gmail.com",
        subject: `Logs de chamada - APP Inteligence | ${currentData}`,
        attachments: [
          { filename: "Relatório de chamadas.xlsx", path: "./reports.xlsx" },
        ],
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          res
            .status(400)
            .json({ status: false, message: "Erro ao enviar o email" });
        } else {
          res.status(201).json({
            status: true,
            message: "Email enviado com sucesso",
          });
        }
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        status: false,
        message: "Ocorreu um erro interno no servidor, tente novamente.!",
        err,
      });
    }
  };

  static CheckReconection = async (req, res) => {
    const { id_user } = req.body;

    try {
      const result = await api_channels.findOne({
        where: {
          [Op.or]: [
            { id_user_one: id_user },
            { id_user_two: id_user },
            { id_user_three: id_user },
            { id_user_fourth: id_user },
          ],
        },
      });

      if (result) {
        // O id_user foi encontrado em um dos campos
        res.status(200).json({
          message: "Usuário encontrado!",
          status: true,
          name: result.name,
        });
      } else {
        // O id_user não foi encontrado em nenhum dos campos
        res
          .status(200)
          .json({ message: "Usuário não encontrado!", status: false });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  };

  static leaveChannel = async (req, res) => {
    const { channel_name } = req.body;

    try {
      const result = await api_channels.findOne({
        where: { name: channel_name },
      });

      if (result) {
        const updatedUsersOnline = result.usersOnline - 1;

        if (updatedUsersOnline === 0) {
          await api_channels.destroy({ where: { name: channel_name } });
          res
            .status(200)
            .json({ message: "Registro excluído do banco de dados!" });
        } else {
          await YourModel.decrement("usersOnline", {
            where: { name: channel_name },
          });
          res
            .status(200)
            .json({ message: "Número de usuários online reduzido!" });
        }
      } else {
        res.status(404).json({ message: "Registro não encontrado!" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  };
}

module.exports = VideoCallController;
