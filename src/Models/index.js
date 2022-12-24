import sequelize from "../Config/Config";

sequelize
  .sync()
  .then(() => {
    console.log("tables created suceel");
  })
  .catch((error) => console.error("Unable to create table : ", error));
