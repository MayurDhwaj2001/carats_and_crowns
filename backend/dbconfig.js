module.exports = {
  db: {
    database: process.env.DB_DATABASE || "carats_and_crowns",
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "123",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    dialect: process.env.DB_DIALECT || "postgres",
  },
};
