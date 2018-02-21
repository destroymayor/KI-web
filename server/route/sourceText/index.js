import { Query } from '../../db/config';

export default (app) => {
  app.get('/sourcetext', (req, res) => {
    const sql = 'SELECT * FROM test.sourcetext';

    Query(sql)
      .then((rows) => {
        res.json(rows);
        // return db.Close();
      })
      .catch((error) => {
        res.json({ error });
      });
  });
};
