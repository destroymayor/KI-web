const router = require("express").Router();

const db = require("../../db/DBConfig");

router.get("/", (req, res) => {
  const sql = "SELECT * FROM test.Keyword";
  db.Query(sql).then(rows => {
    res.json(rows);
  });
});

module.exports = router;
