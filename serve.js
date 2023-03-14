const app = require("./src/app.js");

const port = 8080;

app.listen(process.env.port || port, () => {
  console.log(`backend rodando na porta ${port}`);
});
