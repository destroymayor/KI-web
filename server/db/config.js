const mysql = require('mysql');

// 連線池
const pool = mysql.createPool({
  host: '140.125.84.189',
  user: 'root',
  password: 'mismb207',
  database: 'china_sea',
  port: 3306,
  connectionLimit: 30,
});

exports.Query = sql =>
  new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) return reject(err);

      return connection.query(sql, (error, rows) => {
        if (error) return reject(error);
        resolve(rows);
        connection.release();

        console.log('\nConnection closed \n-----------------');
      });
    });
  });

exports.Close = () =>
  new Promise((resolve, reject) => {
    pool.end((err) => {
      if (err) return reject(err);
      return resolve();
    });
  });

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
