require("dotenv").config();

module.exports = {
  development: {
    username: process.env.LOCAL_DB_USERNAME,
    password: process.env.LOCAL_DB_PASSWORD,
    database: process.env.LOCAL_DB_NAME,
    host: process.env.LOCAL_DB_HOST,
    dialect: "mysql",
  },
  test: {
    username: process.env.CLOUD_DB_USERNAME,
    password: process.env.CLOUD_DB_PASSWORD,
    database: process.env.CLOUD_DB_NAME,
    host: process.env.CLOUD_DB_HOST,
    dialect: "mysql",
  },
  production: {
    username: process.env.CLOUD_DB_USERNAME,
    password: process.env.CLOUD_DB_PASSWORD,
    database: process.env.CLOUD_DB_NAME,
    host: process.env.CLOUD_DB_HOST,
    dialect: "mysql",
  },
};
