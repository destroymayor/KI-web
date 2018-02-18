const db = require('../../db/config');

module.exports = (app) => {
  app.get('/sourcetext', (req, res) => {
    const sql = 'SELECT * FROM test.sourcetext';
    db
      .Query(sql)
      .then((rows) => {
        res.json(rows);
        // return db.Close();
      })
      .catch((error) => {
        res.json({ error });
      });
  });
};
