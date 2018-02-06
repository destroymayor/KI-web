const router = require("express").Router();

const db = require("../../db/dbConfig");

router.get("/", (req, res) => {
  const sql = "SELECT * FROM test.Keyword";
  db.fetchData((err, result) => {
    if (err) throw err;
    res.json(result);
  }, sql);
});

module.exports = router;
