const router = require("express").Router();
const nodejieba = require("nodejieba");
//載入字典
nodejieba.load(__dirname + "./jieba_Dictionary/Jieba_TW.utf8");

const db = require("../../db/dbConfig");

router.get("/", (req, res) => {
  //文章參數
  let pages = req.query.page;

  db.query("SELECT * FROM test.sourcetext", (error, results, fields) => {
    if (error) throw error;
    console.log(results[pages - 1]);
    res.json(nodejieba.extract(results[pages - 1].content, 20));
  });
});

module.exports = router;
