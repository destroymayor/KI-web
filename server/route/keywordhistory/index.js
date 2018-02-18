const db = require('../../db/config');

module.exports = (app) => {
  app.get('/keywordhistory', (req, res) => {
    const sql = 'SELECT * FROM test.Keyword';

    db
      .Query(sql)
      .then((rows) => {
        console.log('keyword history output \n', rows);
        res.json(rows);
      })
      .catch((error) => {
        res.json({ error });
      });
  });
};
