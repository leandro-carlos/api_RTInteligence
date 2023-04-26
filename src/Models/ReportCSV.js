const sequelize = require("../Config/Config.js");

const reportCSV = sequelize.define("api_reportCSV", {
  id: {
    type: sequelize.Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: sequelize.Sequelize.STRING,
    // allowNull: false,
  },
  email: {
    type: sequelize.Sequelize.STRING,
    // allowNull: false,
  },
  hourEnter: {
    type: sequelize.Sequelize.STRING,
    // allowNull: false,
  },
  hourExit: {
    type: sequelize.Sequelize.STRING,
    // allowNull: false,
  },
  roomName: {
    type: sequelize.Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = reportCSV;
