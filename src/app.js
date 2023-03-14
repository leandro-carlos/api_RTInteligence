const Express = require("express");
const routes = require("./Routes.js");

const app = Express();
app.use(Express.json());
app.use(routes);

module.exports = app;
