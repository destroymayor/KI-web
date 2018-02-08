import React from "react";

//載入ant design 組件庫
import { Table } from "antd";

const KwHistoryTable = dataSource => (
  <Table
    dataSource={dataSource}
    className="kwTable"
    size="small"
    rowKey={key => key.index}
    columns={[
      {
        title: "Kw",
        children: [
          {
            title: "關鍵字",
            dataIndex: "keyword",
            key: "keyword"
          },
          {
            title: "出現頻率",
            dataIndex: "frequency",
            key: "frequency"
          },
          {
            title: "初始位置",
            dataIndex: "localtag",
            key: "localtag"
          }
        ]
      }
    ]}
  />
);

const JiebaTable = dataSource => (
  <Table
    dataSource={dataSource}
    className="pkwTable"
    size="small"
    rowKey={key => key.word}
    columns={[
      {
        title: "pKw",
        children: [
          {
            title: "關鍵字",
            dataIndex: "word",
            key: "word"
          },
          {
            title: "權重值",
            dataIndex: "weight",
            key: "weight"
          }
        ]
      }
    ]}
  />
);

export { KwHistoryTable, JiebaTable };
