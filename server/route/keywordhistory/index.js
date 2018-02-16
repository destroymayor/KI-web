const router = require('express').Router();

const db = require('../../db/config');

router.get('/', (req, res) => {
  const sql = 'SELECT * FROM test.Keyword';
  db.Query(sql).then((rows) => {
    console.log('keyword history output \n', rows);
    res.json(rows);
  });
});

module.exports = router;
