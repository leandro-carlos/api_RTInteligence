import { Router } from "express";

// Controladores

import LoginController from "./Controllers/LoginController.js";

const routes = new Router();

// rotas do usuario

routes.post("/register", LoginController.register); // faltando implementar a funcionalidade!
routes.get("/users", LoginController.getAllUser);
routes.post("/login", LoginController.login);

export default routes;
