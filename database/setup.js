//Creating database and models
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: `database/${process.env.DB_NAME}` || 'database/music_library.db',
  logging: console.log // Enable logging to see SQL queries
});