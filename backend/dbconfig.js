require("dotenv").config();

module.exports = {
  db: {
    //   "database": process.env.database,
    //   "username": process.env.username,
    //   "password": process.env.password,
    //  " port": process.env.port,
    //   "host": process.env.host,
    //   "dialect": process.env.dialect,

    database: "carats_and_crowns",
    username: "postgres",
    password: "123",
    host: "localhost",
    port: 5432,
    dialect: "postgres",
  },
};
