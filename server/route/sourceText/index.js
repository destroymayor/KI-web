const router = require("express").Router();

const db = require("../../db/dbConfig");

router.get("/", (req, res) => {
  db.query("SELECT * FROM test.sourcetext", (error, results, fields) => {
    if (error) throw error;
    res.json(results);
  });
});

module.exports = router;
