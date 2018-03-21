import nodejieba from 'nodejieba';

import { Query } from '../../db/config';

nodejieba.load(`${__dirname}./jieba_Dictionary/Jieba_TW.utf8`);

export default (app) => {
  app.get('/totalkeyword', (req, res) => {
    const pages = req.query.page;
    Query('SELECT * FROM test.question')
      .then((rows) => {
        console.log(pages);
        res.json(nodejieba.extract(rows[pages - 1].q_title, 20));
      })
      .catch((error) => {
        res.json({ error });
      });
  });

  app.get('/totalkeyword_page', (req, res) => {
    Query('SELECT * FROM test.question')
      .then((rows) => {
        res.json(rows);
      })
      .catch((error) => {
        res.json({ error });
      });
  });

  app.get('/totalkeyword_page_answer', (req, res) => {
    Query('SELECT * FROM test.answer')
      .then((rows) => {
        res.json(rows);
      })
      .catch((error) => {
        res.json({ error });
      });
  });

  app.get('/totalkeyword_answer', (req, res) => {
    const pages = req.query.page;
    Query('SELECT * FROM test.answer')
      .then((rows) => {
        console.log(pages);
        res.json(nodejieba.extract(rows[pages - 1].a_context, 20));
      })
      .catch((error) => {
        res.json({ error });
      });
  });
};
