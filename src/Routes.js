import { Router } from "express";

// Controladores

import LoginController from "./Controllers/LoginController.js";
import PerguntasController from "./Controllers/PerguntasController.js";

const routes = new Router();

// rotas do usuario

routes.post("/register", LoginController.register);
routes.post("/login", LoginController.login);
routes.get("/getAllQuestions", PerguntasController.getAllPerguntas);
routes.post("/respostaQuestionario", PerguntasController.responderPerguntas);

export default routes;
