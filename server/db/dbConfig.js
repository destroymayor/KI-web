const mysql = require("mysql");

//連線池
const pool = mysql.createPool({
  host: "140.125.84.189",
  user: "root",
  password: "mismb207",
  database: "china_sea",
  port: 3306
});

exports.Query = sql => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) return reject(err);

      connection.query(sql, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
        connection.release();
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
  //其他操作
})
*/
