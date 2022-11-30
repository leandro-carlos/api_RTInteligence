import Express from "express";
import sequelize from "./Config/Config.js";
import User from "./Models/User.js";
// import routes from "./Routes.js";

const app = Express();
// app.use(routes);
app.use(Express.json());

// sequelize
//   .sync()
//   .then(() => {
//     User.findAll().then((res) => {
//       console.log(res.length);
//     });
//   })
//   .catch((e) => console.log(e));

// app.get("/users", (req, res) => {
//   return res.send("teste");
// });

sequelize.sync().then(() => {
  User.create({
    name: "dasda",
    email: "dada@dakja.com",
    password: "32131",
  }).then((err) => console.log("deu certo", err));
});

export default app;
