import multiparty from "multiparty";
import fs from "fs";

import PDFParser from "pdf2json";

export default app => {
  app.post("/pdf2txt", (req, res) => {
    const form = new multiparty.Form();
    form.parse(req, (err, fields, files) => {
      const { path: tempPath } = files.pdf[0];

      let pdfParser = new PDFParser(this, 1);

      pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
      pdfParser.on("pdfParser_dataReady", pdfData => {
        fs.writeFile("./M10623015.txt", pdfParser.getRawTextContent());
        res.json({ output: pdfParser.getRawTextContent() });
      });
      pdfParser.loadPDF(tempPath);
    });
  });
};
