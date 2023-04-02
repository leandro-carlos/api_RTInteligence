const { Router } = require("express");

// Controladores

const LoginController = require("./Controllers/LoginController.js");
const PerguntasController = require("./Controllers/PerguntasController.js");
const AcaoController = require("./Controllers/AcaoController.js");
const AdminController = require("./Controllers/AdminController.js");
const VideoCallController = require("./Controllers/VideoCallController.js");

const routes = new Router();
// Route of user

routes.post("/login", LoginController.login); // Logar
// Route of quiz

routes.get("/getAllQuestions", PerguntasController.getAllQuestions); // Listar todas as perguntas e categorias

// Route of action

routes.post("/answerFollower", AcaoController.answerFollower); // Responde o acompanhamento
routes.post("/answerQuizAndAction", AcaoController.answerQuizAndAction); // Responde o quiz, o ação e também insere campos na tabela de datas e atualiza o finalizou.

// Route of Result

routes.post("/dataToGraph", PerguntasController.dataToGraph); // Dados pra tela de resultado. (nota e categorias)
routes.post("/getActionAndFollow", PerguntasController.getActionAndFollow); // Recupera a resposta do ação e acompanhamento
routes.post("/dataComparative", PerguntasController.getComparative); // Gráfico comparativo

//Route of dropDown dates
routes.post("/dates", PerguntasController.dates); // rota que alimenta a tabela de datas que serve pra todas outras

// Route of Admin

routes.post("/register", LoginController.register); // Registrar um novo usúario
routes.get("/getAllUsers", AdminController.getAllUsers); // lista todos usuarios
routes.put("/updateUser/:id", AdminController.updateUser); // Atualiza um id especifico
routes.post("/deleteUser", AdminController.deleteUser); // Deleta o usuario e todos seus registros
routes.post("/restart", AdminController.restart); // Reinicia o questionario do usuario, rota espera uma data e um id no corpo.

// Route version

routes.get("/checkVersion", LoginController.checkVersion); // Checkar versão do app + api

// Route Video Call
routes.post("/token", VideoCallController.getVideoToken); //Pegar token para entrar em video call.
routes.post("/reconect", VideoCallController.reconect); // reconectar no canal caso naõ tenha passado x minutos.
module.exports = routes;
