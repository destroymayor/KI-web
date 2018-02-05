const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "140.125.84.189",
  user: "root",
  password: "mismb207",
  database: "china_sea"
});

module.exports = connection;
