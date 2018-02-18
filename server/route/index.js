const sourcetext = require('./sourceText/index');
const keywordhistory = require('./keywordhistory/index');
const jieba = require('./jieba/index');

module.exports = (app) => {
  [sourcetext, keywordhistory, jieba].forEach((router) => {
    router(app);
  });
};
