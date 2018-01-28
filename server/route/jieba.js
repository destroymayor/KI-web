const express = require("express");
const router = express.Router();
const nodejieba = require("nodejieba");

const ArticleFewArticles = [
  "（中央社記者韋樞台北2018年1月25日電）股市追漲不追跌的特性同樣適用於房市，房仲發現，新北重劃區降價換成交如同吸嗎啡，初期奏效，但降價策略不停止，在投資人不追跌的情形下買氣必停，土城暫緩發展區要提高警覺。 在房市一片讓利風下，降價才有來客數，有來客數才有機會成交，似乎讓利成了房市成交的唯一藥方，於是新屋餘屋多的重劃區多用降價換成交策略。 中信房屋副總劉天仁表示，股市的特性就是追漲不追跌，房市降價換成交的銷售策略如同雙面刃，更像嗎啡。初期銷售必然亮眼，但若降價策略不適可而止，同業勢必打價格戰，更將造成消費者觀望氣氛，買氣反而會驟然停滯，市場陷入觀望。 劉天仁發現，新北市板橋江翠北側重劃區及土城暫緩發展重劃區為新北市兩大熱門重劃區，部份建案銷售情況不錯，但往往只有降價取量，也就是區域內第一個降價案奏效後，其他建案勢必跟進，否則無法銷售，若開出比第一案更低價，市場就會陷入無底的價格戰，長期的價格戰無異於嗎啡，購屋人麻痺了，市場自然陷入觀望停滯。 劉天仁提醒，這兩個重劃區的推案潮應會從現在起延續到第3季以後，若建商或代銷業者的銷售策略不改變，預料土城暫緩發展重劃區空殺空的情況會在第2季前就會發生，屆時將發生買氣停滯的情況。 至於板橋江翠北側重劃區從2016年7月起經歷一年多的空殺空洗禮，目前此區預售屋價格甚至演變成不同區位，但卻是均一價的情況，所幸價格不再競跌，近期買氣才稍有回升。"
];

router.get("/", (req, res) => {
  //載入字典
  nodejieba.load(__dirname + "./Jieba_TW.utf8");
  //文章參數
  const pages = req.body("page");

  switch (pages) {
    case "1":
      res.json(nodejieba.extract(ArticleFewArticles[0], 14));
      break;
  }
});

module.exports = router;
