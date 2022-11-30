import { Sequelize } from "sequelize";

const sequelize = new Sequelize("rtinteligence", "root", "", {
  host: "localhost",
  dialect: "mysql",
  storage: "C:/Users/leand/OneDrive/Desktop/NLW_Gamer",
});

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
