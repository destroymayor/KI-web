const nodejieba = require('nodejieba');
// 載入字典
nodejieba.load(`${__dirname}./jieba_Dictionary/Jieba_TW.utf8`);

const db = require('../../db/config');

module.exports = (app) => {
  app.get('/jieba', (req, res) => {
    // 文章參數
    const pages = req.query.page;
    const sql = 'SELECT * FROM test.sourcetext';

    db
      .Query(sql)
      .then((rows) => {
        console.log('jieba output \n', nodejieba.extract(rows[pages - 1].content, 20));
        res.json(nodejieba.extract(rows[pages - 1].content, 20));
        // return db.Close();
      })
      .catch((error) => {
        res.json({ error });
      });
  });
};
