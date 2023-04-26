const { email } = require("../Config/Email.js");
const { api_reportCsv } = require("../Models/index.js");

const { createTransport } = require("nodemailer");
const createCsvWriter = require("csv-writer");

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

    const csvWritter = createCsvWriter.createArrayCsvWriter({
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

    const mailOptions = {
      from: email.auth.user,
      to: "leandro.carlosleo2015@gmail.com",
      subject: "Dados da tabela",
      attachments: [{ filename: "dados.csv", content: "csvWritter" }],
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
        res.json({ status: true, data: info.response });
      }
    });

    // api_reportCsv.findAll().then((data) => {
    //   csvWritter.writeRecords(data[0].dataValues).then(() => {
    //     res.json({ status: true, data: data });
    //   });
    // });

    // Cria um objeto de transporte de e-mail com as credenciais de origem

    // Define as opções de e-mail, incluindo o destinatário, o assunto e o anexo CSV

    // Envia o e-mail
  };
}

module.exports = VideoCallController;
