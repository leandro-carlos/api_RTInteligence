import { Router } from "express";

// Controladores

import LoginController from "./Controllers/LoginController.js";
import PerguntasController from "./Controllers/PerguntasController.js";

const routes = new Router();

// rotas do usuario

routes.post("/register", LoginController.register);
routes.post("/login", LoginController.login);

// Rota de Questionario

routes.get("/getAllQuestions", PerguntasController.getAllQuestions);
routes.post("/replyQuiz", PerguntasController.replyQuiz);

// Rota de resultados

routes.post("/calculoNivel", PerguntasController.calculoNivel);

export default routes;
