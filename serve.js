import app from "./src/app.js";

const port = 3000;

app.listen(process.env.port || port, () => {
  console.log(`backend rodando na porta ${port}`);
});
