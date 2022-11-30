import { Router } from "express";

// Controladores

import LoginController from "./Controllers/LoginController.js";

const routes = new Router();

routes.get("/users", LoginController.handleLogin);

export default routes;
