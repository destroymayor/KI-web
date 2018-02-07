const router = require("express").Router();

const db = require("../../db/DBConfig");

router.get("/", (req, res) => {
  const sql = "SELECT * FROM test.sourcetext";
  db.fetchData((err, result) => {
    if (err) throw err;
    res.json(result);
  }, sql);

  db.Query(sql).then(row => {
    console.log(row);
  });
});

module.exports = router;
