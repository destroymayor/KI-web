import axios from "axios";
import { Icon, List, message, Select } from "antd";

import React, { Component } from "react";
import "./index.css";

import Menu from "../../utils/Menu/index";
import Buttons from "../../utils/components/Buttons";
import { KwHistoryTable, JiebaTable } from "./component/Table";

// Select component option
const Option = Select.Option;

class KeyWordIdentify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Loading State
      SourceTextLoadingState: false,
      // 下拉組件集合
      SourceTextSelectItem: [],
      // 下拉組件初始化String
      SourceTextSelectedOption: "1",
      // 讀取tx庫
      SourceText: "",
      // 讀取tx字元位置
      SourceTextLocalTags: "",
      // 讀取kw歷史庫
      KwHistory: [],
      // jieba
      jiebaList: [],
      jiebaLoadingState: false,
      FetchjiebaListDisabledState: true,
      FetchjiebaListLoadingState: false,
      // 復原Ur標註
      UrTagRecovery: [],
      // 人工標記集合
      GetSelectedTextList: [],
      // kw參數的List
      KwTotal: [],
      KwTotalLoadingState: false,
      // 讀取歷史kw庫按鈕狀態
      FetchKeyWordHistoryDisabledState: true,
      FetchKeyWordHistoryLoadingState: false
    };
  }

  componentDidMount() {
    this.FetchSourceText();
  }

  // 讀取sourceText庫資料
  FetchSourceText() {
    axios
      .get("/sourcetext")
      .then(response => {
        response.data.forEach((value, index) => {
          this.state.SourceTextSelectItem.push(
            <Option key={index} value={value.content}>
              {index + 1}
            </Option>
          );
        });

        this.setState({
          // loading state
          SourceTextLoadingState: true,
          // open 讀取歷史kw庫按鈕
          FetchKeyWordHistoryDisabledState: false,
          // open jieba 按鈕狀態
          FetchjiebaListDisabledState: false,
          SourceText: response.data[0].content,
          // 標出tx庫位置的集合
          SourceTextLocalTags: response.data[0].content
        });
      })
      .catch(error => {
        console.log("fetch source text", error);
        message.error("無法連接，請稍後再試!");
      });
  }

  // 讀取歷史kw庫資料
  FetchKeyWordHistory() {
    this.setState({
      // loading 讀取歷史kw庫按鈕
      FetchKeyWordHistoryLoadingState: true,
      // close 讀取歷史kw庫按鈕
      FetchKeyWordHistoryDisabledState: true
    });
    const KwHistoryArray = [];
    axios
      .get("/keywordhistory")
      .then(response => {
        response.data.forEach(value => {
          KwHistoryArray.push(value.name);
        });

        this.setState({
          // 儲存kw歷史庫
          KwHistory: KwHistoryArray,
          // 讀取歷史kw庫並標出顏色(綠色)
          SourceText: this.state.SourceText.replace(
            new RegExp(KwHistoryArray.join("|"), "g"),
            val => `<em style="color:#00A600;">${val}</em>`
          ),
          // render keyword table view
          KwTotalLoadingState: true
        });

        // kw頻率及位置
        this.state.KwHistory.forEach((value, index) => {
          const frequencyState = this.state.SourceText.match(new RegExp(value, "g") || []) === null;
          this.state.KwTotal.push({
            index: index,
            // kw
            keyword: frequencyState ? null : value,
            // 出現頻率
            frequency: frequencyState
              ? null
              : this.state.SourceText.match(new RegExp(value, "g") || []).length,
            // 出現位置字元
            localtag: frequencyState ? null : this.state.SourceTextLocalTags.indexOf(value)
          });
        });

        // 過濾null值
        this.setState({
          KwTotal: this.state.KwTotal.filter(value => {
            return value.keyword !== null;
          }),
          // loading 讀取歷史kw庫按鈕
          FetchKeyWordHistoryLoadingState: false
        });
      })
      .catch(error => {
        console.log("fetch keyword history error", error);
        this.setState({ FetchKeyWordHistoryLoadingState: false });
        message.error("無法連接，請稍後再試!");
      });
  }

  // jieba
  FetchJiebaList() {
    // fetch jieba button state
    this.setState({ FetchjiebaListDisabledState: true, FetchjiebaListLoadingState: true });
    axios
      .get("/jieba?page=" + this.state.SourceTextSelectedOption)
      .then(response => {
        const JiebaListArray = [];
        response.data.forEach(value => {
          JiebaListArray.push(value.word);
          // 將資料push 至 table view
          this.state.jiebaList.push({ word: value.word, weight: value.weight.toFixed(2) });
        });

        // source tx 標記jieba顏色
        this.setState({
          SourceText: this.state.SourceText.replace(
            new RegExp(JiebaListArray.join("|"), "g"),
            val => `<em style="color:#2897ff;">${val}</em>`
          )
        });

        // render jieba table view
        this.setState({ jiebaLoadingState: true, FetchjiebaListLoadingState: false });
      })
      .catch(error => {
        this.setState({ FetchjiebaListLoadingState: false });
        message.error("無法連接，請稍後再試!");
        console.log("fetch jieba error", error);
      });
  }

  // handle 下拉組件
  HandleSelect = selectValue => {
    this.setState({
      SourceText: selectValue.key,
      SourceTextLocalTags: selectValue.key,
      SourceTextSelectedOption: selectValue.label,
      // 歷史kw庫
      KwTotal: [],
      KwTotalLoadingState: false,
      // jieba庫
      jiebaList: [],
      jiebaLoadingState: false,
      // open 讀取kw按鈕狀態
      FetchKeyWordHistoryLoadingState: false,
      FetchKeyWordHistoryDisabledState: false,
      // open jieba 按鈕狀態
      FetchjiebaListDisabledState: false,
      FetchjiebaListLoadingState: false
    });
  };

  // Ur人工標色
  GetSelectedText() {
    let Selection = window.getSelection().getRangeAt(0);
    let SelectedText = Selection.extractContents();
    let SelectSpan = document.createElement("span");
    SelectSpan.appendChild(SelectedText);
    Selection.insertNode(SelectSpan);

    if (Selection.toString() !== "") {
      this.state.GetSelectedTextList.push(Selection.toString());

      // 復原標記 list
      this.state.UrTagRecovery.push(Selection.toString());
      this.setState({
        SourceText: this.state.SourceText.replace(
          Selection.toString(),
          `<span style="background-color: rgb(234, 0, 0);">${Selection.toString()}</span>`
        )
      });
    }
  }

  // Ur人工新增
  // InsertTextTag() {}

  // 復原Ur選取標記
  RemoveTextTagRange(item) {
    this.setState({
      SourceText: this.state.SourceText.replace(
        `<span style="background-color: rgb(234, 0, 0);">${item}</span>`,
        item
      )
    });
    this.setState({
      UrTagRecovery: this.state.UrTagRecovery.filter(val => val !== item),
      GetSelectedTextList: this.state.GetSelectedTextList.filter(val => val !== item)
    });
  }

  renderBtnItem = () => (
    <div className="ButtonItem">
      <Buttons
        Type={"primary"}
        Text={"讀取歷史Kw"}
        Icon={"database"}
        loading={this.state.FetchKeyWordHistoryLoadingState}
        disabled={this.state.FetchKeyWordHistoryDisabledState}
        onClick={() => {
          this.FetchKeyWordHistory();
        }}
      />
      <Buttons
        Type={"primary"}
        Text={"讀取pKw"}
        Icon={"database"}
        loading={this.state.FetchjiebaListLoadingState}
        disabled={this.state.FetchjiebaListDisabledState}
        onClick={() => {
          this.FetchJiebaList();
        }}
      />
      <Buttons
        Type="primary"
        Text={"新增標記"}
        Icon={"file-add"}
        disabled={this.state.UrTagRecovery.length !== 0 ? false : true}
        onClick={() => {
          // this.InsertTextTag();
        }}
      />
      <Buttons
        Type={"primary"}
        Text={"復原全部標記"}
        Icon={"reload"}
        disabled={this.state.UrTagRecovery.length !== 0 ? false : true}
        onClick={() => {
          this.setState({
            SourceText: this.state.SourceText.replace(/<\/?span[^>]*>/g, ""),
            GetSelectedTextList: [],
            UrTagRecovery: []
          });
        }}
      />
    </div>
  );

  render() {
    return (
      <div className="Ki">
        <Menu renderPage="Expert" />
        <div className="SelectComponent">
          <div>選擇文章</div>
          <Select
            className="KI_selectComponent"
            style={{ width: 300 }}
            labelInValue
            placeholder={this.state.SourceTextSelectedOption}
            onChange={this.HandleSelect}
          >
            {this.state.SourceTextSelectItem}
          </Select>
        </div>
        {this.renderBtnItem()}
        <div className="SourceText">
          <div id="SourceTextItem">
            {this.state.SourceTextLoadingState ? (
              <div
                id="SourceTextContent"
                onMouseUp={() => this.GetSelectedText()}
                dangerouslySetInnerHTML={{ __html: this.state.SourceText }}
              />
            ) : (
              <Icon type="loading" style={{ fontSize: 24 }} spin />
            )}
          </div>
          <div id="ManualTag-List">
            <List
              header={<div>已標注的kw</div>}
              bordered
              dataSource={this.state.GetSelectedTextList}
              renderItem={item => (
                <List.Item>
                  <div id="ManualTag-ListItem">
                    {item}
                    <Buttons
                      Icon={"delete"}
                      onClick={() => {
                        this.RemoveTextTagRange(item);
                      }}
                    />
                  </div>
                </List.Item>
              )}
            />
          </div>
        </div>
        <div className="TableComponent">
          {this.state.KwTotalLoadingState ? KwHistoryTable(this.state.KwTotal) : null}
          {this.state.jiebaLoadingState ? JiebaTable(this.state.jiebaList) : null}
        </div>
      </div>
    );
  }
}

export default KeyWordIdentify;
