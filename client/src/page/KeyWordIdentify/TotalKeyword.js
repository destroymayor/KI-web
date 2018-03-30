import axios from "axios";

import { Input, InputNumber, Table } from "antd";

import React, { Component } from "react";

import Buttons from "../../utils/components/Buttons";

class TotalKeyword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FetchStartState: false,
      NumberOfArticles: 50,
      FilterKeyword1: "",
      FilterKeyword2: "",
      TotalNumber_Question: [],
      TotalNumber_Answer: [],
      TotalKeyQuestion: [],
      TotalKeyAnswer: []
    };

    this.CancelToken = axios.CancelToken.source();
  }

  componentWillUnmount() {
    if (this.CancelToken) {
      this.CancelToken.cancel("KeywordIdentify Component Is Unmounting");
    }
    clearInterval(this.renderList);
  }

  // fetch data //
  FetchQA() {
    axios.get("/totalkeyword_page", { cancelToken: this.CancelToken.token }).then(response => {
      response.data.forEach((value, index) => {
        if (index <= this.state.NumberOfArticles) {
          this.state.TotalNumber_Question.push({ page: parseInt(index + 1, 10), content: value.q_title });
        }
      });
    });

    axios.get("/totalkeyword_page_answer", { cancelToken: this.CancelToken.token }).then(response => {
      response.data.forEach((value, index) => {
        if (index <= this.state.NumberOfArticles) {
          this.state.TotalNumber_Answer.push({ page: parseInt(index + 1, 10), content: value.a_context });
        }
      });
    });
  }

  FetchTotalKeywordList() {
    this.state.TotalNumber_Question.forEach((value, index) => {
      // question
      axios
        .get("/totalkeyword?page=" + parseInt(index + 1, 10), { cancelToken: this.CancelToken.token })
        .then(response => {
          response.data.forEach(value => {
            this.state.TotalKeyQuestion.push({
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
    this.mergeList(this.state.TotalKeyQuestion);
    this.mergeList(this.state.TotalKeyAnswer);

    // this.renderList = setInterval(() => {
    //   console.log("render");
    this.setState({ FetchStartState: true });
    // }, 1000);
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

  FilterKeyword(word, word2) {
    console.log(word, word2);
    this.state.TotalNumber_Question.forEach(value => {
      if (value.content.search(word) !== -1 && value.content.search(word2) !== -1) {
        console.log("question =>", value.content);
      }
    });

    this.state.TotalNumber_Answer.forEach(value => {
      if (value.content.search(word) !== -1 && value.content.search(word2) !== -1) {
        console.log("answer =>", value.content);
      }
    });
  }

  render() {
    return (
      <div className="Ki">
        <div className="ButtonItem">
          <InputNumber
            min={50}
            max={1600}
            defaultValue={50}
            onChange={NumberOfArticles => {
              this.setState({ NumberOfArticles });
              console.log(NumberOfArticles);
            }}
          />
          <Buttons
            Type={"primary"}
            Text={"Fetch QA"}
            onClick={() => {
              this.FetchQA();
            }}
          />
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
          <div>
            過濾關鍵字
            <Input
              style={{ width: 100 }}
              onChange={e => {
                this.setState({ FilterKeyword1: e.target.value });
              }}
            />
            <Input
              style={{ width: 100, marginLeft: 10 }}
              onChange={e => {
                this.setState({ FilterKeyword2: e.target.value });
              }}
            />
            <Buttons
              Type={"primary"}
              Text={"Filter Word"}
              onClick={() => {
                this.FilterKeyword(this.state.FilterKeyword1, this.state.FilterKeyword2);
              }}
            />
          </div>
        </div>
        <div className="TotalKeywordTable">
          <Table
            bordered
            id="TotalKeywordTable"
            size={"small"}
            rowKey={key => key.word}
            scroll={{ y: 500 }}
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
            dataSource={this.removeDuplicity(this.state.TotalKeyQuestion)}
          />
          <Table
            bordered
            id="TotalKeywordTable"
            size={"small"}
            rowKey={key => key.word}
            scroll={{ y: 500 }}
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
