import axios from "axios";

import { Icon, List, message, Spin, Select } from "antd";

import React, { Component } from "react";
import "./index.css";

import Menu from "../../utils/Menu/index";
import Buttons from "../../utils/components/Buttons";
import { KwHistoryTable, JiebaTable } from "./component/Table";
import TotalKeyWord from "./TotalKeyword";

const Option = Select.Option; // Select component option

class KeyWordIdentify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      SourceTextLoadingState: false, // Loading State
      SourceTextSelectItem: [], // 下拉組件集合
      SourceTextSelectedOption: "1", // 下拉組件初始化String
      SourceText: "", // 讀取tx庫
      SourceTextLocalTags: "", // 讀取tx字元位置
      KwHistory: [], // 讀取kw歷史庫
      jiebaList: [], // jieba
      jiebaLoadingState: false,
      FetchjiebaListDisabledState: true,
      FetchjiebaListLoadingState: false,
      UrTagRecovery: [], // 復原Ur標註
      GetSelectedTextList: [], // 人工標記集合
      KwTotal: [], // kw參數的List
      KwTotalLoadingState: false, // 讀取歷史kw庫按鈕狀態
      FetchKeyWordHistoryDisabledState: true,
      FetchKeyWordHistoryLoadingState: false
    };

    this.CancelToken = axios.CancelToken.source();
  }

  componentDidMount() {
    this.FetchSourceText();
  }

  componentWillUnmount() {
    if (this.CancelToken) {
      this.CancelToken.cancel("KeywordIdentify Component Is Unmounting");
    }
  }

  // fetch data //
  // 讀取sourceText庫資料
  FetchSourceText() {
    axios
      .get("/sourcetext", { cancelToken: this.CancelToken.token })
      .then(response => {
        response.data.forEach((value, index) => {
          this.state.SourceTextSelectItem.push(
            <Option key={index} value={value.content}>
              {index + 1}
            </Option>
          );
        });

        this.setState({
          SourceTextLoadingState: true, // loading state
          FetchKeyWordHistoryDisabledState: false, // open 讀取歷史kw庫按鈕
          FetchjiebaListDisabledState: false, // open jieba 按鈕狀態
          SourceText: response.data[0].content,
          SourceTextLocalTags: response.data[0].content // 標出tx庫位置的集合
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
      FetchKeyWordHistoryLoadingState: true,
      FetchKeyWordHistoryDisabledState: true
    });
    const KwHistoryArray = [];

    axios
      .get("/keywordhistory", { cancelToken: this.CancelToken.token })
      .then(response => {
        response.data.forEach(value => {
          KwHistoryArray.push(value.name);
        });

        this.setState({
          KwHistory: KwHistoryArray, // 儲存kw歷史庫
          SourceText: this.state.SourceText.replace(
            // 讀取歷史kw庫並標出顏色(綠色)
            new RegExp(KwHistoryArray.join("|"), "g"),
            val => `<em style="color:#00A600;">${val}</em>`
          ),
          KwTotalLoadingState: true // render keyword table view
        });

        // kw頻率及位置
        this.state.KwHistory.forEach((value, index) => {
          const frequencyState = this.state.SourceText.match(new RegExp(value, "g") || []) === null;
          this.state.KwTotal.push({
            index: index,
            keyword: frequencyState ? null : value, // kw
            frequency: frequencyState ? null : this.state.SourceText.match(new RegExp(value, "g") || []).length, // 出現頻率
            localtag: frequencyState ? null : this.state.SourceTextLocalTags.indexOf(value) // 出現位置字元
          });
        });

        // 過濾null值
        this.setState({
          KwTotal: this.state.KwTotal.filter(value => {
            return value.keyword !== null;
          }),
          FetchKeyWordHistoryLoadingState: false // loading 讀取歷史kw庫按鈕
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
    this.setState({ FetchjiebaListDisabledState: true, FetchjiebaListLoadingState: true }); // fetch jieba button state
    axios
      .get("/jieba?page=" + this.state.SourceTextSelectedOption, { cancelToken: this.CancelToken.token })
      .then(response => {
        const JiebaListArray = [];
        response.data.forEach(value => {
          JiebaListArray.push(value.word);
          this.state.jiebaList.push({ word: value.word, weight: value.weight.toFixed(2) }); // 將資料push 至 table view
        });

        // source tx 標記jieba顏色
        this.setState({
          SourceText: this.state.SourceText.replace(
            new RegExp(JiebaListArray.join("|"), "g"),
            val => `<em style="color:#2897ff;">${val}</em>`
          )
        });

        this.setState({ jiebaLoadingState: true, FetchjiebaListLoadingState: false }); // render jieba table view
      })
      .catch(error => {
        this.setState({ FetchjiebaListLoadingState: false });
        message.error("無法連接，請稍後再試!");
        console.log("fetch jieba error", error);
      });
  }

  // fetch data end//

  // handle 下拉組件
  HandleSelect = selectValue => {
    this.setState({
      SourceText: selectValue.key,
      SourceTextLocalTags: selectValue.key,
      SourceTextSelectedOption: selectValue.label,
      KwTotal: [], // 歷史kw庫
      KwTotalLoadingState: false,
      jiebaList: [], // jieba庫
      jiebaLoadingState: false,
      FetchKeyWordHistoryLoadingState: false, // open 讀取kw按鈕狀態
      FetchKeyWordHistoryDisabledState: false,
      FetchjiebaListDisabledState: false, // open jieba 按鈕狀態
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

      this.state.UrTagRecovery.push(Selection.toString()); // 復原標記 list
      this.setState({
        SourceText: this.state.SourceText.replace(
          Selection.toString(),
          `<span style="background-color: rgb(234, 0, 0);">${Selection.toString()}</span>`
        )
      });
    }
  }

  // 復原Ur選取標記
  RemoveTextTagRange(item) {
    this.setState({
      SourceText: this.state.SourceText.replace(`<span style="background-color: rgb(234, 0, 0);">${item}</span>`, item)
    });
    this.setState({
      UrTagRecovery: this.state.UrTagRecovery.filter(val => val !== item),
      GetSelectedTextList: this.state.GetSelectedTextList.filter(val => val !== item)
    });
  }

  _renderSelectPageComponent = () => (
    <div className="SelectComponent">
      <div>選擇文章</div>
      <Select
        style={{ width: 300 }}
        labelInValue
        notFoundContent={<Spin size="small" />}
        placeholder={this.state.SourceTextSelectedOption}
        onChange={this.HandleSelect}
      >
        {this.state.SourceTextSelectItem}
      </Select>
    </div>
  );

  _renderBtnItem = () => (
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

  _renderSourceText = () => (
    <div id="SourceTextItem">
      {this.state.SourceTextLoadingState ? (
        <div id="SourceTextContent" onMouseUp={() => this.GetSelectedText()} dangerouslySetInnerHTML={{ __html: this.state.SourceText }} />
      ) : (
        <Icon type="loading" style={{ fontSize: 24 }} spin />
      )}
      <div className="TableComponent">
        {this.state.KwTotalLoadingState ? KwHistoryTable(this.state.KwTotal) : null}
        {this.state.jiebaLoadingState ? JiebaTable(this.state.jiebaList) : null}
      </div>
    </div>
  );

  _renderManualTagList = () => (
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
  );

  render() {
    return (
      <div className="Ki">
        <Menu renderPage="Expert" />
        {this._renderSelectPageComponent()}
        {this._renderBtnItem()}

        <div className="SourceText">
          {this._renderSourceText()}
          {this._renderManualTagList()}
        </div>
        <div className="TotalKeywordTable">
          <TotalKeyWord />
        </div>
      </div>
    );
  }
}

export default KeyWordIdentify;
