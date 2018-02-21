import { Query } from '../../db/config';

export default (app) => {
  app.get('/sourcetext', (req, res) => {
    Query('SELECT * FROM test.sourcetext')
      .then((rows) => {
        res.json(rows);
        // return db.Close();
      })
      .catch((error) => {
        res.json({ error });
      });
  });
};
