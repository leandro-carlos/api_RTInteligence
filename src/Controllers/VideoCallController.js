const { email } = require("../Config/Email.js");
const { api_reportCsv } = require("../Models/index.js");
const fs = require("fs");
const { createTransport } = require("nodemailer");
const XLSX = require("xlsx");
const readXlsxFile = require("read-excel-file");
const fetch = require("node-fetch");
const { format } = require("date-fns");

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

  static SendEmail = async (req, res) => {
    const transporter = createTransport(email);

    try {
      const data = await api_reportCsv.findAll();

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
        subject: `Logs de chamada - APP Inteligence || ${currentData}`,
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
}

module.exports = VideoCallController;
