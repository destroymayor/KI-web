module.exports = (app) => {
  app.use('/sourcetext', require('./sourceText/index'));
  app.use('/keywordhistory', require('./keywordhistory/index'));
  app.use('/jieba', require('./jieba/index'));
};
