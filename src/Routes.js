import { Router } from "express";

// Controladores

import LoginController from "./Controllers/LoginController.js";
import PerguntasController from "./Controllers/PerguntasController.js";
import AcaoController from "./Controllers/AcaoController.js";
import AdminController from "./Controllers/AdminController.js";

const routes = new Router();

// Route of user

routes.post("/login", LoginController.login); // Logar

// Route of quiz

routes.get("/getAllQuestions", PerguntasController.getAllQuestions); // Listar todas as perguntas

// Route of action

routes.post("/answerFollower", AcaoController.answerFollower); // reply a action (with goal) and the 3 follow up (3 text input)
routes.post("/answerQuizAndAction", AcaoController.answerQuizAndAction); // reply a action (with goal) and the 3 follow up (3 text input)

// Route of Result

routes.post("/dataToGraph", PerguntasController.dataToGraph); // Route to return of data to graph
routes.post("/getActionAndFollow", PerguntasController.getActionAndFollow);
routes.post("/dataComparative", PerguntasController.getComparative);

//Route of dropDown dates
routes.post("/dates", PerguntasController.dates);

// Route of Admin

routes.post("/register", LoginController.register); // Registrar um novo usúario
routes.get("/getAllUsers", AdminController.getAllUsers); // Listar all users
routes.put("/updateUser/:id", AdminController.updateUser);
routes.post("/deleteUser", AdminController.deleteUser);
routes.post("/restart", AdminController.restart);

// Route version

routes.get("/checkVersion", LoginController.checkVersion);

export default routes;
