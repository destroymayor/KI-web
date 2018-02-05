const db = require("./dbConfig");

exports.DBQuery = () => {
  return db.query("SELECT * FROM construct WHERE id LIKE '%' AND name LIKE '%'", (error, results, fields) => {
    if (error) throw error;
    console.log("select", results[0]);
  });
};
