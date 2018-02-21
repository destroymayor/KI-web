import { Query } from '../../db/config';

export default (app) => {
  app.get('/keywordhistory', (req, res) => {
    const sql = 'SELECT * FROM test.Keyword';

    Query(sql)
      .then((rows) => {
        console.log('keyword history output \n', rows);
        res.json(rows);
      })
      .catch((error) => {
        res.json({ error });
      });
  });
};
