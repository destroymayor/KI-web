import mysql from 'mysql';

const pool = mysql.createPool({
  host: '140.125.84.195',
  user: 'root',
  password: 'mismb207',
  database: 'chain_sea',
  port: 3306,
  connectionLimit: 30,
  connectTimeout: 20000,
  acquireTimeout: 20000,
});

const Query = sql =>
  new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.log('pool getConnection error');
        return reject(err);
      }

      return connection.query(sql, (error, rows) => {
        connection.release(); // 釋放連接
        if (error) {
          console.log('query error', error);
          return reject(error);
        }

        resolve(rows);

        return console.log(` \n ${sql} \n Connection closed => ${new Date().toLocaleString()} \n `);
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
