import { Router } from "express";

// Controladores

import LoginController from "./Controllers/LoginController.js";

const routes = new Router();

// rotas do usuario

routes.get("/users", LoginController.handleLogin);
routes.post("/login", LoginController.login);
routes.post("/register", LoginController.register); // faltando implementar a funcionalidade!

export default routes;
