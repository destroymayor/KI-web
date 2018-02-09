const router = require("express").Router();
const nodejieba = require("nodejieba");
//載入字典
nodejieba.load(__dirname + "./jieba_Dictionary/Jieba_TW.utf8");

const db = require("../../db/DBConfig");

router.get("/", (req, res) => {
  //文章參數
  let pages = req.query.page;
  const sql = "SELECT * FROM test.sourcetext";
  db.Query(sql).then(rows => {
    console.log(rows[pages - 1]);
    res.json(nodejieba.extract(rows[pages - 1].content, 20));
    // return db.Close();
  });
});

module.exports = router;
