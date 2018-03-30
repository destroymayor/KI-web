import fs from "fs";
import nodejieba from "nodejieba";

import { Query } from "./server/db/config";

nodejieba.load(`${__dirname}./jieba_Dictionary/Jieba_TW.utf8`);

const total = {
  table: []
};
//a
// Query("SELECT * FROM test.answer LIMIT 1,1600")
//   .then(rows => {
//     for (let i = 1; i < 1600; ++i) {
//       //nodejieba.extract(rows[i].a_context, 20).map((value, index) => total.table.push({ keyword: value.word, value: [i] }));
//       total.table.push("page " + i + " => " + rows[i].a_context);
//     }

//     fs.writeFile("./answer_page.json", JSON.stringify(total), err => {});
//   })
//   .catch(error => {
//     console.log(error);
//   });

//q
// Query("SELECT * FROM test.question")
//   .then(rows => {
//     for (let i = 1; i < 1600; ++i) {
//       //  nodejieba.extract(rows[i].q_title, 20).map((value, index) => total.table.push({ keyword: value.word, value: [i] }));

//     }
//     fs.writeFile("./question_page.json", JSON.stringify(total), err => {});
//   })
//   .catch(error => {
//     console.log(error);
//   });

// fs.readFile("./total_question.json", "utf8", (err, data) => {
//   if (err) throw err;
//   const totalQuestion = JSON.parse(data);
//   const output = [];

//   const merged = totalQuestion.table.reduce((acc, obj) => {
//     if (acc[obj.keyword]) {
//       acc[obj.keyword].value = acc[obj.keyword].value.isArray
//         ? acc[obj.keyword].value.concat(obj.value)
//         : [acc[obj.keyword].value].concat(obj.value);
//     } else {
//       acc[obj.keyword] = obj;
//     }
//     return acc;
//   }, {});

//   for (let prop in merged) {
//     output.push(merged[prop]);
//   }

// //   fs.writeFile("./total_a.json", JSON.stringify(output), err => {
// //     if (err) throw err;
// //   });
// });

// fs.readFile("./total_a.json", "utf8", (err, data) => {
//   if (err) throw err;
//   const totalQuestion = JSON.parse(data);
//   const ss = totalQuestion.filter((item, index, arr) => {
//     const c = arr.map(item => item.keyword);
//     return index === c.indexOf(item.keyword) && item.value.length !== 1;
//   });

//   //   fs.writeFile("./total_a.json", JSON.stringify(ss), err => {});
// });
