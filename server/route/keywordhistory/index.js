import { Query } from '../../db/config';

export default (app) => {
  app.get('/keywordhistory', (req, res) => {
    Query('SELECT * FROM test.Keyword')
      .then((rows) => {
        console.log('keyword history output \n', rows);
        res.json(rows);
      })
      .catch((error) => {
        res.json({ error });
      });
  });
};
