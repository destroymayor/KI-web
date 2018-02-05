module.exports = app => {
  app.use("/jieba", require("./jieba/index"));
};
