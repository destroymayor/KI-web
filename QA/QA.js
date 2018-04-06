import fs from 'fs';

import xl from 'excel4node';
import xlsx from 'node-xlsx';
import { Query } from '../server/db/config';

const wb = new xl.Workbook();
const ws = wb.addWorksheet('Page 1');
const style = wb.createStyle({
  font: { size: 12 },
});

const TotalOriginKeyword = async () => {
  const origin = [];
  await fs.readFile('./QA/page_q.json', 'utf8', (errs, page) => {
    const pages = JSON.parse(page);
    pages.forEach((val) => {
      if (val.content.match(/額度|銀行/) !== null) {
        origin.push({
          value: val.value,
          content: val.content,
        });
      }
    });
    // wb.write('./QA/page_qa.xlsx');
  });

  // page
  await fs.readFile('./QA/page_q.json', 'utf8', (errs, page) => {
    const pages = JSON.parse(page);
    pages.forEach((val, index) => {
      ws
        .cell(parseInt(index + 2, 10), 2)
        .string(`page: ${val.content}`)
        .style(style);
    });
    wb.write('./QA/page_qa.xlsx');
  });
};

const writeExcel = async () => {
  // ws
  //   .cell(1, 1)
  //   .string('Q&A')
  //   .style(style);

  // await fs.readFile('./QA/total_q.json', 'utf8', (err, data) => {
  //   const question = JSON.parse(data);
  //   question.forEach((value, index) => {
  //     ws
  //       .cell(index + 2, 1)
  //       .string(value.keyword)
  //       .style(style);
  //   });
  //   wb.write('./QA/QA_total.xlsx');
  //   console.log('write Excel question done');
  // });

  // await fs.readFile('./QA/total_a.json', 'utf8', (err, data) => {
  //   if (err) throw err;
  //   const answer = JSON.parse(data);
  //   answer.forEach((value, index) => {
  //     ws
  //       .cell(1, index + 2)
  //       .string(value.keyword)
  //       .style(style);
  //   });
  //   wb.write('./QA/QA_total.xlsx');
  //   console.log('write Excel answer done');
  // });

  const workSheetsFromBuffer = xlsx.parse(`${__dirname}/QA.xlsx`);
  const keylist = [];
  await fs.readFile('./QA/page_q.json', 'utf8', (errs, page) => {
    const pages = JSON.parse(page);

    // 迭代矩陣 y=746 x=1178
    for (let i = 1; i < 20; i += 1) {
      for (let j = 1; j < 20; j += 1) {
        pages.forEach((val) => {
          const Yasix = val.content.match(workSheetsFromBuffer[0].data[i]) !== null;
          const Xasix = val.content.match(workSheetsFromBuffer[0].data[0][j]) !== null;
          const some =
            workSheetsFromBuffer[0].data[i].toString() !== workSheetsFromBuffer[0].data[0][j];
          if (Yasix && Xasix && some) {
            keylist.push({
              page: val.value,
              QuestionKeyword: workSheetsFromBuffer[0].data[i].toString(),
              AnswerKeyword: workSheetsFromBuffer[0].data[0][j],
              content: val.content,
            });
            // ws
            //   .cell(i + 1, j + 1)
            //   .string(`${val.value} , keyword: ${workSheetsFromBuffer[0].data[0][j]} , ${
            //     workSheetsFromBuffer[0].data[i]
            //   }, / ,${val.content}`)
            //   .style(style);

            console.log(
              val.value,
              `keyword:${workSheetsFromBuffer[0].data[i]},${workSheetsFromBuffer[0].data[0][j]}/`,
              val.content,
            );
          }
        });
      }
    }

    fs.writeFile('./QA/result.json', JSON.stringify(keylist), (error) => {});
    // wb.write('./QA/QA_total.xlsx');
    console.log('write Excel QA keyword done');
  });
};

const readResult = async () => {
  fs.readFile('./QA/result.json', 'utf8', (err, data) => {
    if (err) console.log(err);
    const list = JSON.parse(data);

    list.forEach((val) => {
      if (val.QuestionKeyword === '分期' && val.AnswerKeyword === '問題') {
        console.log(` ${val.page} Question:${val.QuestionKeyword}, Answer:${val.AnswerKeyword} content: ${
          val.content
        }`);
      }
    });
  });
};

// SparseMatrix();

// writeExcel();
readResult();
