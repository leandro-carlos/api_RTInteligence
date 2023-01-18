import { Router } from "express";

// Controladores

import LoginController from "./Controllers/LoginController.js";
import PerguntasController from "./Controllers/PerguntasController.js";
import AcaoController from "./Controllers/AcaoController.js";
import AdminController from "./Controllers/AdminController.js";

const routes = new Router();

// Route of user

routes.post("/register", LoginController.register); // Registrar um novo usúario
routes.post("/login", LoginController.login); // Logar

// Route of quiz

routes.get("/getAllQuestions", PerguntasController.getAllQuestions); // Listar todas as perguntas
routes.post("/replyQuiz", PerguntasController.replyQuiz); // Responder cada pergunta do questionario.

// Route of action

routes.post("/answerActionAndFollow", AcaoController.answerActionAndFollowUp); // reply a action (with goal) and the 3 follow up (3 text input)
routes.post("/teste", AcaoController.testeUp); // reply a action (with goal) and the 3 follow up (3 text input)

// Route of Result

routes.post("/dataToGraph", PerguntasController.dataToGraph); // Route to return of data to graph
routes.post("/getActionAndFollow", PerguntasController.getActionAndFollow);

//Route of dropDown dates
routes.post("/dates", PerguntasController.dates);

// Route of Admin

routes.get("/getAllUsers", AdminController.getAllUsers); // Listar all users
routes.post("/deleteUser", AdminController.deleteUser);
routes.put("/updateUser/:id", AdminController.updateUser);

export default routes;
