import fs from "fs";

import _ from "lodash";

import xl from "excel4node";
import xlsx from "node-xlsx";

const wb = new xl.Workbook();
const ws = wb.addWorksheet("Page 1");
const style = wb.createStyle({
  font: { size: 12 }
});

const writeExcel = async () => {
  ws
    .cell(1, 1)
    .string("")
    .style(style);

  await fs.readFile("./QA/total_question_sort.json", "utf8", (err, data) => {
    const question = JSON.parse(data);
    question.forEach((value, index) => {
      ws
        .cell(index + 2, 1)
        .string(value.keyword)
        .style(style);
    });
  });

  await fs.readFile("./QA/total_answer_sort.json", "utf8", (err, data) => {
    const answer = JSON.parse(data);
    answer.forEach((value, index) => {
      ws
        .cell(1, index + 2)
        .string(value.keyword)
        .style(style);
    });
  });

  const workSheetsFromBuffer = xlsx.parse(`${__dirname}/QA.xlsx`);
  const output = [];

  await fs.readFile("./QA/page_q.json", "utf8", (errs, page) => {
    const pages = JSON.parse(page);
    // 迭代矩陣 y=746 x=1178
    for (let i = 1; i < 20; i += 1) {
      for (let j = 1; j < 20; j += 1) {
        pages.forEach(val => {
          const ExcelAsix =
            val.content.match(workSheetsFromBuffer[0].data[i]) !== null &&
            val.content.match(workSheetsFromBuffer[0].data[0][j]) !== null;
          const someKeyword = workSheetsFromBuffer[0].data[i].toString() !== workSheetsFromBuffer[0].data[0][j];
          const filterQ =
            workSheetsFromBuffer[0].data[i].toString() !== "問題" && workSheetsFromBuffer[0].data[i].toString() !== "Re";
          const filterA = workSheetsFromBuffer[0].data[0][j] !== "問題" && workSheetsFromBuffer[0].data[0][j] !== "Re";
          if (ExcelAsix && someKeyword && filterQ && filterA) {
            // ws
            //   .cell(i + 1, j + 1)
            //   .string(val.value)
            //   .style(style);
            // output.push({
            //   page: val.value,
            //   Question: workSheetsFromBuffer[0].data[i],
            //   Answer: workSheetsFromBuffer[0].data[0][j],
            //   content: val.content
            // });
            console.log(
              i,
              j,
              val.value,
              `/ ${workSheetsFromBuffer[0].data[i]},${workSheetsFromBuffer[0].data[0][j]} /`,
              val.content
            );
          }
        });
      }
    }

    // fs.writeFile("./QA/QA.json", JSON.stringify(output), errs => {});

    wb.write("./QA/QA_total1.xlsx");
    console.log("write Excel QA keyword done");
  });
};

const readResult = async () => {
  await fs.readFile("./QA/QA.json", "utf8", (err, data) => {
    const list = JSON.parse(data);

    list.forEach((value, index) => {
      const Asix = value.content.match(value.Question) !== null && value.content.match(value.Answer) !== null;
      if (Asix) {
        console.log(`${value.page} / ${value.Question} ${value.Answer} / ${value.content}`);
      }
    });
    console.log("done");
  });
};

const readFile = () => {
  fs.readFile("./QA/result.json", "utf8", (err, data) => {
    const totalQuestion = JSON.parse(data);
    const output = [];
    const merged = totalQuestion.reduce((acc, obj) => {
      if (acc[obj.content]) {
        acc[obj.content].content = acc[obj.content].content.isArray
          ? acc[obj.content].content.concat(obj.content)
          : acc[obj.content].content.concat(obj.content);
      } else {
        acc[obj.content] = obj;
      }
      return acc;
    }, {});

    for (const prop in merged) {
      output.push(merged[prop]);
    }

    fs.writeFile("./QA/finial_result.json", JSON.stringify(output), errs => {
      if (errs) throw errs;
    });
  });
};

// SparseMatrix();

// writeExcel();
//readResult();

// readFile();
