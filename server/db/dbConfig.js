const mysql = require("mysql");

const connection = mysql.createConnection({
  port: 3306,
  host: "140.125.84.189",
  user: "root",
  password: "mismb207",
  database: "china_sea"
});

//連線池
const pool = mysql.createPool({
  host: "140.125.84.189",
  user: "root",
  password: "mismb207",
  database: "china_sea",
  port: 3306
});

//select
exports.fetchData = (callback, sqlQuery) => {
  console.log("\n SQL Query", sqlQuery);
  pool.getConnection((err, connection) => {
    connection.query(sqlQuery, (err, results, fields) => {
      if (err) {
        console.log("err message", err.message);
      } else {
        callback(err, results);
        console.log("\nConnection closed \n-----------------");
        connection.release();
      }
    });
  });
};

//insert && update && delete
exports.insertData = (callback, sqlQuery) => {
  console.log("\n SQL Query", sqlQuery);
  pool.getConnection((err, connection) => {
    connection.query(sqlQuery, (err, results) => {
      if (err) {
        console.log("err message", err.message);
      } else {
        callback(err, results);
        console.log("\n CRUD successfully \n---------------------");
        connection.release();
      }
    });
  });
};
