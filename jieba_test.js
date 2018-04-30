const nodejieba = require("nodejieba");

nodejieba.load({ userDict: "./server/route/jieba/jieba_Dictionary/Jieba_TW.utf8" });

console.log(nodejieba.tag("花旗信用卡申辦後面的數字代表的意義？"));
