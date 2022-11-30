import Express from "express";
import sequelize from "./Config/Config.js";
import User from "./Models/User.js";

const app = Express();
app.use(Express.json());

sequelize.sync().then(() => {
  User.create({
    name: "dasda",
    email: "dada@dakja.com",
    password: "32131",
  }).then((err) => console.log("deu certo", err));
});

export default app;
