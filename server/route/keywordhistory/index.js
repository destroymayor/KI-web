const router = require("express").Router();

const db = require("../../db/dbConfig");

router.get("/", (req, res) => {
  db.query("SELECT * FROM test.Keyword", (error, results, fields) => {
    if (error) throw error;
    console.log(results);
    res.json(results);
  });
});

module.exports = router;
