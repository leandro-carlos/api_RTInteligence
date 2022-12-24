import { Router } from "express";

// Controladores

import LoginController from "./Controllers/LoginController.js";
import PerguntasController from "./Controllers/PerguntasController.js";
import AcaoController from './Controllers/AcaoController.js'

const routes = new Router();

// rotas do usuario

routes.post("/register", LoginController.register);
routes.post("/login", LoginController.login);

// Rota de Questionario

routes.get("/getAllQuestions", PerguntasController.getAllQuestions);
routes.post("/replyQuiz", PerguntasController.replyQuiz);

// Rota de resultados

routes.post("/calculoNivel", PerguntasController.calculoNivel);

// Rotas de acao

routes.post("/teste", AcaoController.respondrAcao);

export default routes;
