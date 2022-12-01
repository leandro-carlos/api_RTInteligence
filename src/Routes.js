import { Router } from "express";

// Controladores

import LoginController from "./Controllers/LoginController.js";

const routes = new Router();

// rotas do usuario

routes.post("/register", LoginController.register);
routes.post("/login", LoginController.login);

export default routes;
