import { Query } from '../../db/config';

export default (app) => {
  app.get('/keywordhistory', (req, res) => {
    Query('SELECT * FROM test.Keyword')
      .then((rows) => {
        res.json(rows); // console.log('keyword history output \n', rows);
      })
      .catch((error) => {
        res.json({ error });
      });
  });
};
