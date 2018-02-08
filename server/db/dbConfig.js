const mysql = require("mysql");

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
    if (err) throw err;
    connection.query(sqlQuery, (err, results, fields) => {
      if (err) {
        console.log("err message", err.message);
      } else {
        callback(err, results);
        console.log("\nConnection closed \n-----------------");
      }
    });
  });
};

exports.Query = sqlQuery => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      connection.query(sqlQuery, args, (err, results) => {
        if (err) return reject(err);

        resolve(results);
        console.log("\nConnection closed \n-----------------");
      });
    });
  });
};

exports.Close = () => {
  return new Promise((resolve, reject) => {
    pool.end(err => {
      if (err) return reject(err);

      resolve();
    });
  });
};

/*
example
多次查詢
let someRows,otherRows;

Query('SELECT * FROM table').then(rows => {
  someRows = rows;
  return Query('SELECT * FROM other_table');
}).then(rows => {
  otherRows = rows;
  return Close();
}).then(() => {
  其他操作
})
*/
