import fs from 'fs';
import nodejieba from 'nodejieba';

import { Query } from '../server/db/config';

nodejieba.load(`${__dirname}./jieba_Dictionary/Jieba_TW.utf8`);

const total = {
  table: [],
};

const Question = () => {
  Query('SELECT * FROM test.question')
    .then((rows) => {
      for (let i = 1; i < 1600; ++i) {
        nodejieba.extract(rows[i].q_title, 20).map((value, index) =>
          total.table.push({
            keyword: value.word,
            weight: [value.weight.toFixed(2)],
            value: [i],
          }));
      }
      fs.writeFile('./QA/question_page.json', JSON.stringify(total), (err) => {});
    })
    .catch((error) => {
      console.log(error);
    });
};

const Answer = () => {
  Query('SELECT * FROM test.answer LIMIT 1,1600')
    .then((rows) => {
      for (let i = 1; i < 1600; i += 1) {
        nodejieba.extract(rows[i].a_context, 20).map((value, index) =>
          total.table.push({
            keyword: value.word,
            weight: [value.weight.toFixed(2)],
            value: [i],
          }));
      }

      fs.writeFile('./QA/answer_page.json', JSON.stringify(total), (err) => {});
    })
    .catch((error) => {
      console.log(error);
    });
};

const readFile = () => {
  fs.readFile('./QA/answer_page.json', 'utf8', (err, data) => {
    if (err) throw err;
    const totalQuestion = JSON.parse(data);
    const output = [];

    const merged = totalQuestion.table.reduce((acc, obj) => {
      if (acc[obj.keyword]) {
        acc[obj.keyword].value = acc[obj.keyword].value.isArray
          ? acc[obj.keyword].value.concat(obj.value)
          : acc[obj.keyword].value.concat(obj.value);

        acc[obj.keyword].weight = acc[obj.keyword].weight.isArray
          ? acc[obj.keyword].weight.concat(obj.weight)
          : acc[obj.keyword].weight.concat(obj.weight);
      } else {
        acc[obj.keyword] = obj;
      }
      return acc;
    }, {});

    for (const prop in merged) {
      output.push(merged[prop]);
    }

    fs.writeFile('./QA/answer_page.json', JSON.stringify(output), (err) => {
      if (err) throw err;
    });
  });
};

const mergeList = () => {
  fs.readFile('./QA/answer_page.json', 'utf8', (err, data) => {
    if (err) throw err;
    const totalQuestion = JSON.parse(data);
    const ss = totalQuestion.filter((item, index, arr) => {
      const c = arr.map(items => items.keyword);
      return index === c.indexOf(item.keyword) && item.value.length !== 1;
    });

    fs.writeFile('./QA/answer_page.json', JSON.stringify(ss), (error) => {});
  });
};

const SortList = () => {
  fs.readFile('./QA/answer_page.json', 'utf8', (err, data) => {
    if (err) throw err;
    const totalQuestion = JSON.parse(data);
    totalQuestion.sort((a, b) => b.value.length - a.value.length);
    fs.writeFile('./QA/answer_page.json', JSON.stringify(totalQuestion), (error) => {});
  });
};
