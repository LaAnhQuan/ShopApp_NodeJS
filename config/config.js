require('dotenv').config();

module.exports = {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD || null,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "port": parseInt(process.env.DB_PORT, 10),
    "dialect": process.env.DB_DIALECT
  }
}