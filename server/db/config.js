import mysql from 'mysql';

const pool = mysql.createPool({
  host: '140.125.84.195',
  user: 'root',
  password: 'mismb207',
  database: 'chain_sea',
  port: 3306,
  connectionLimit: 30,
});

const Query = sql =>
  new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) return reject(err);

      return connection.query(sql, (error, rows) => {
        if (error) return reject(error);
        resolve(rows);
        connection.release();

        return console.log(` \nConnection closed => ${new Date().toLocaleString()} \n `);
      });
    });
  });

const Close = () =>
  new Promise((resolve, reject) => {
    pool.end((err) => {
      if (err) return reject(err);
      return resolve();
    });
  });

export { Query, Close };

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
