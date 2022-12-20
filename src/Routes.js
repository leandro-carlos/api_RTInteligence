import { Router } from "express";
import app from "./app.js";

// Controladores

import LoginController from "./Controllers/LoginController.js";
import PerguntasController from "./Controllers/PerguntasController.js";

const routes = new Router();

// rotas do usuario

routes.post("/register", LoginController.register);
routes.post("/login", LoginController.login);

// Rota de perguntas

routes.get("/getAllQuestions", PerguntasController.getAllQuestions);
routes.post("/replyQuiz", PerguntasController.replyQuiz);

export default routes;
