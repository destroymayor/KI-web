import axios from "axios";

import { Table } from "antd";

import React, { Component } from "react";
import "./index.css";

import Buttons from "../../utils/components/Buttons";

class TotalKeyword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FetchStartState: false,
      TotalNumber: [],
      TotalNumber_Answer: [],
      TotalKey: [],
      TotalKeyAnswer: []
    };

    this.CancelToken = axios.CancelToken.source();
  }

  componentDidMount() {
    this.FetchQA();
  }

  componentWillUnmount() {
    if (this.CancelToken) {
      this.CancelToken.cancel("KeywordIdentify Component Is Unmounting");
    }
  }

  // fetch data //
  FetchQA() {
    axios.get("/totalkeyword_page", { cancelToken: this.CancelToken.token }).then(response => {
      response.data.forEach((value, index) => {
        if (index <= 100) {
          this.state.TotalNumber.push({ page: parseInt(index + 1, 10), content: value.q_title });
        }
      });
    });

    axios.get("/totalkeyword_page_answer", { cancelToken: this.CancelToken.token }).then(response => {
      response.data.forEach((value, index) => {
        if (index <= 100) {
          this.state.TotalNumber_Answer.push({ page: parseInt(index + 1, 10), content: value.a_context });
        }
      });
    });
  }

  FetchTotalKeywordList() {
    this.state.TotalNumber.forEach((value, index) => {
      // question
      axios
        .get("/totalkeyword?page=" + parseInt(index + 1, 10), { cancelToken: this.CancelToken.token })
        .then(response => {
          response.data.forEach(value => {
            this.state.TotalKey.push({
              word: value.word,
              value: parseInt(index + 1, 10),
              weight: value.weight.toFixed(2)
            });
          });
        })
        .catch(err => {
          console.log(err);
        });

      //answer
      axios
        .get("/totalkeyword_answer?page=" + parseInt(index + 1, 10), { cancelToken: this.CancelToken.token })
        .then(response => {
          response.data.forEach(value => {
            this.state.TotalKeyAnswer.push({
              word: value.word,
              value: parseInt(index + 1, 10),
              weight: value.weight.toFixed(2)
            });
          });
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  // fetch data end//

  renderTotalKeywordList() {
    this.setState({ FetchStartState: true });
    this.state.TotalNumber.forEach(value => {
      if (value.content.search("銀行") !== -1 && value.content.search("信用卡") !== -1) {
        console.log("question =>", value.content);
      }
      console.log(value.content);
    });

    this.state.TotalNumber_Answer.forEach(value => {
      if (value.content.search("銀行") !== -1 && value.content.search("信用卡") !== -1) {
        console.log("answer =>", value.content);
      }
    });
    this.mergeList(this.state.TotalKey);
    this.mergeList(this.state.TotalKeyAnswer);
  }

  mergeList(data) {
    const merged = data.reduce((acc, obj) => {
      if (acc[obj.word]) {
        acc[obj.word].value = acc[obj.word].value.isArray ? acc[obj.word].value.concat(obj.value) : [acc[obj.word].value].concat(obj.value);
      } else {
        acc[obj.word] = obj;
      }
      return acc;
    }, {});

    const output = [];
    for (let prop in merged) {
      output.push(merged[prop]);
    }
  }

  removeDuplicity(data) {
    return data.filter((item, index, arr) => {
      const c = arr.map(item => item.word);
      return index === c.indexOf(item.word) && item.value instanceof Array;
    });
  }

  render() {
    return (
      <div className="Ki">
        <div className="ButtonItem">
          <Buttons
            Type={"primary"}
            Text={"start"}
            onClick={() => {
              this.FetchTotalKeywordList();
            }}
          />
          <Buttons
            Type={"primary"}
            Text={"render"}
            onClick={() => {
              this.renderTotalKeywordList();
            }}
          />
        </div>
        <div className="TotalKeywordTable">
          <Table
            bordered
            id="TotalKeywordTable"
            size={"small"}
            pagination={false}
            rowKey={key => key.word}
            columns={[
              { title: "keyword", width: 100, dataIndex: "word", key: "word", fixed: "left" },
              {
                title: "Question",
                dataIndex: "value",
                key: "value",
                render: text => <span>{` ${text} `}</span>
              },
              {
                title: "權重",
                dataIndex: "weight",
                key: "weight",
                width: 70
              }
            ]}
            dataSource={this.removeDuplicity(this.state.TotalKey)}
          />
          <Table
            bordered
            id="TotalKeywordTable"
            size={"small"}
            pagination={false}
            rowKey={key => key.word}
            columns={[
              { title: "keyword", width: 100, dataIndex: "word", key: "word", fixed: "left" },
              {
                title: "Answer",
                dataIndex: "value",
                key: "value",
                render: text => <span>{` ${text} `}</span>
              },
              {
                title: "權重",
                dataIndex: "weight",
                key: "weight",
                width: 70
              }
            ]}
            dataSource={this.removeDuplicity(this.state.TotalKeyAnswer)}
          />
        </div>
      </div>
    );
  }
}

export default TotalKeyword;
