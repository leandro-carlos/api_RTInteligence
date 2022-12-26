import Express from "express";
import routes from "./Routes.js";

const app = Express();
app.use(Express.json());
app.use(routes);

export default app;
