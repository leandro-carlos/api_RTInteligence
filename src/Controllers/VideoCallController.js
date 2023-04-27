const { email } = require("../Config/Email.js");
const { api_reportCsv } = require("../Models/index.js");

const { createTransport } = require("nodemailer");
const createCsvWriter = require("csv-writer");
const XLSX = require("xlsx");

class VideoCallController {
  static EnterThreeUsersInCall = async (req, res) => {
    const body = {
      id_user: req.body.id_user,
      data: req.body.data,
      hourEnter: req.body.hourEnter,
      roomName: req.body.roomName,
      name: req.body.name,
      email: req.body.email,
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
    const body = {
      id_user: req.body.id_user,
      data: req.body.data,
      hourExit: req.body.hourExit,
    };
  };

  static SendEmail = async (req, res) => {
    const transporter = createTransport(email);

    const csvWriter = createCsvWriter.createObjectCsvWriter({
      path: "./arquivo2.csv",
      header: [
        { id: "15" },
        { name: "leandro" },
        { email: "leandro1@gmail.com" },
        { hourEnter: "15:300" },
        { hourExit: "nul" },
        { roomName: "sala 1" },
        { createdAt: "2023-04-25T15:48:52.000Z" },
        { updatedAt: "2023-04-25T15:48:52.000" },
      ],
    });

    try {
      const data = await api_reportCsv.findAll();
      const workbook = XLSX.utils.book_new();

      const worksheet = XLSX.utils.json_to_sheet(data[0]);

      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      XLSX.writeFile(workbook, "arquivo_excel.xlsx");

      const mailOptions = {
        from: email.auth.user,
        to: "leandro.carlosleo2015@gmail.com",
        subject: "Dados da tabela",
        attachments: [
          { filename: "arquivo2.csv", path: "./arquivo_excel.xlsx" },
        ],
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          res.json({ status: false, message: "Erro ao enviar o email" });
        } else {
          console.log("Email sent: " + info.response);
          res.json({
            status: true,
            message: "Email enviado com sucesso",
            data: data,
          });
        }
      });
    } catch (err) {
      console.log(err);
      res.json({ status: false, message: "Erro ao buscar dados da tabela" });
    }
  };
}

module.exports = VideoCallController;
