// esse arquivo serve pra conexão com o banco de dados, onde tem o banco local e o banco de prod
// passamos como parametros: nome do bd, password, e link do bd.

// import { Sequelize } from "sequelize";

// const sequelize = new Sequelize("rtinteligence", "root", "", {
//   host: "localhost",
//   dialect: "mysql",
// });

// try {
//   sequelize
//     .authenticate()
//     .then((res) =>
//       console.log("Connection has been established successfully.")
//     );
// } catch (err) {
//   console.error("Unable to connect to the database: ", err);
// }

// export default sequelize;

import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "rtinteligence",
  "intelligenceAdm",
  "intelligence147258369",
  {
    host: "intelligence.crc0m61eeiss.us-east-1.rds.amazonaws.com",
    dialect: "mysql",
  }
);

try {
  sequelize
    .authenticate()
    .then((res) =>
      console.log("Connection has been established successfully.")
    );
} catch (err) {
  console.error("Unable to connect to the database: ", err);
}

export default sequelize;
