const router = require("express").Router();

const db = require("../../db/DBConfig");

router.get("/", (req, res) => {
  const sql = "SELECT * FROM test.sourcetext";
  db.Query(sql).then(rows => {
    res.json(rows);
    // return db.Close();
  });
});

module.exports = router;
