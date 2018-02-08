import React, { Component } from "react";
import "./index.css";

//載入ant design 組件庫
import { Icon, Select, Table } from "antd";

import Menu from "../../utils/Menu/index";
import Buttons from "../../utils/components/Buttons";
import { KwHistoryTable, JiebaTable } from "./component/Table";

//Select component option
const Option = Select.Option;

class KeyWordIdentify extends Component {
  state = {
    //Loading State
    SourceTextLoadingState: false,
    //下拉組件集合
    SourceTextSelectItem: [],
    //下拉組件初始化String
    SourceTextSelectedOption: "1",
    //讀取tx庫
    SourceText: "",
    //讀取tx字元位置
    SourceTextLocalTags: "",
    //讀取kw歷史庫
    KwHistory: [],
    //jieba
    jiebaList: [],
    jiebaLoadingState: false,
    FetchjiebaListDisabledState: true,
    FetchjiebaListLoadingState: false,
    //復原Ur標註
    UrTagRecovery: "",
    //人工標記集合
    GetSelectedTextList: [],
    //kw參數的List
    KwTotal: [],
    KwTotalLoadingState: false,
    //讀取歷史kw庫按鈕狀態
    FetchKeyWordHistoryDisabledState: true,
    FetchKeyWordHistoryLoadingState: false
  };

  componentDidMount() {
    this._FetchSourceText();
  }

  //讀取sourceText庫資料
  async _FetchSourceText() {
    try {
      const fetchSourceText = await fetch("/sourcetext");
      const responseData = await fetchSourceText.json();
      //select option
      responseData.forEach((value, index) => {
        this.state.SourceTextSelectItem.push(
          <Option key={index} value={value.content}>
            {index + 1}
          </Option>
        );
      });

      this.setState({
        //loading state
        SourceTextLoadingState: true,
        //open 讀取歷史kw庫按鈕
        FetchKeyWordHistoryDisabledState: false,
        //open jieba 按鈕狀態
        FetchjiebaListDisabledState: false,
        SourceText: responseData[0].content,
        //標出tx庫位置的集合
        SourceTextLocalTags: responseData[0].content
      });
    } catch (error) {
      console.log("fetch source text error", error);
    }
  }

  //讀取歷史kw庫資料
  async _FetchKeyWordHistory() {
    this.setState({
      // loading 讀取歷史kw庫按鈕
      FetchKeyWordHistoryLoadingState: true,
      //close 讀取歷史kw庫按鈕
      FetchKeyWordHistoryDisabledState: true
    });
    const KwHistoryArray = [];
    try {
      const fetchKeywordHistory = await fetch("/keywordhistory");
      const responseData = await fetchKeywordHistory.json();
      responseData.forEach((value, index) => {
        KwHistoryArray.push(value.name);
        this.setState({
          //儲存kw歷史庫
          KwHistory: KwHistoryArray,
          //讀取歷史kw庫並標出顏色(綠色)
          SourceText: this.state.SourceText.replace(
            new RegExp(KwHistoryArray.join("|"), "g"),
            val => `<span style="color:#00A600;">${val}</span>`
          ),
          //render keyword table view
          KwTotalLoadingState: true
        });
      });

      //kw頻率及位置
      this.state.KwHistory.forEach((value, index) => {
        const frequencyState = this.state.SourceText.match(new RegExp(value, "g") || []) === null;
        this.state.KwTotal.push({
          index: index,
          //kw
          keyword: frequencyState ? null : value,
          //出現頻率
          frequency: frequencyState ? null : this.state.SourceText.match(new RegExp(value, "g") || []).length,
          //出現位置字元
          localtag: frequencyState ? null : this.state.SourceTextLocalTags.indexOf(value)
        });
      });

      //過濾null值
      this.setState({
        KwTotal: this.state.KwTotal.filter(value => {
          return value.keyword !== null;
        }),
        // loading 讀取歷史kw庫按鈕
        FetchKeyWordHistoryLoadingState: false
      });
    } catch (error) {
      console.log("fetch keyword history error", error);
    }
  }

  // jieba
  async Fetch_JiebaList() {
    // fetch jieba button state
    this.setState({ FetchjiebaListDisabledState: true, FetchjiebaListLoadingState: true });
    try {
      const fetchJiebaList = await fetch("/jieba?page=" + this.state.SourceTextSelectedOption);
      const responseData = await fetchJiebaList.json();
      responseData.forEach((value, index) => {
        this.setState({
          SourceText: this.state.SourceText.replace(
            new RegExp(value.word, "g"),
            val => `<span style="color:#2897ff;">${val}</span>`
          )
        });
        this.state.jiebaList.push({ word: value.word, weight: value.weight.toFixed(2) });
      });

      //render jieba table view
      this.setState({ jiebaLoadingState: true, FetchjiebaListLoadingState: false });
    } catch (error) {
      console.log("fetch jieba error", error);
    }
  }

  //handle 下拉組件
  HandleSelect = selectValue => {
    this.setState({
      SourceText: selectValue.key,
      SourceTextLocalTags: selectValue.key,
      SourceTextSelectedOption: selectValue.label,
      //歷史kw庫
      KwTotal: [],
      KwTotalLoadingState: false,
      //jieba庫
      jiebaList: [],
      jiebaLoadingState: false,
      //open 讀取kw按鈕狀態
      FetchKeyWordHistoryLoadingState: false,
      FetchKeyWordHistoryDisabledState: false,
      //open jieba 按鈕狀態
      FetchjiebaListDisabledState: false,
      FetchjiebaListLoadingState: false
    });
  };

  //Ur人工標色
  GetSelectedText() {
    let Selection = window.getSelection().getRangeAt(0);
    let SelectedText = Selection.extractContents();
    let SelectSpan = document.createElement("span");
    SelectSpan.style.backgroundColor = "#EA0000";
    SelectSpan.appendChild(SelectedText);
    Selection.insertNode(SelectSpan);
    this.state.GetSelectedTextList.push(Selection.toString());
  }

  //Ur人工新增
  InsertTextTag() {}

  //復原Ur選取標記
  RemoveTextTagRange() {
    this.setState({
      SourceText: this.state.SourceText.replace(
        this.state.UrTagRecovery,
        `<span style="backgroundColor:rgba(255,255,255,0);">${this.state.UrTagRecovery}</span>`
      )
    });
  }

  _renderBtnItem = () => (
    <div className="ButtonItem">
      <Buttons
        type="primary"
        loading={this.state.FetchKeyWordHistoryLoadingState}
        disabled={this.state.FetchKeyWordHistoryDisabledState}
        Text={"讀取歷史Kw庫"}
        onClick={() => {
          this._FetchKeyWordHistory();
        }}
      />
      <Buttons
        loading={this.state.FetchjiebaListLoadingState}
        disabled={this.state.FetchjiebaListDisabledState}
        Text={"透過TextRank算出pKw"}
        onClick={() => {
          this.Fetch_JiebaList();
        }}
      />
      <Buttons
        Text={"新增標記至資料庫"}
        onClick={() => {
          this.InsertTextTag();
        }}
      />
      <Buttons
        Text={"取消標記"}
        onClick={() => {
          this.RemoveTextTagRange();
        }}
      />
    </div>
  );

  render() {
    return (
      <div className="Ki">
        <Menu renderPage="Expert" />
        <h3>SourceTx庫</h3>
        <div className="SelectComponent">
          <Select
            className="KI_selectComponent"
            style={{ width: "20%" }}
            labelInValue
            placeholder={this.state.SourceTextSelectedOption}
            onChange={this.HandleSelect}
          >
            {this.state.SourceTextSelectItem}
          </Select>
        </div>
        {this._renderBtnItem()}
        <div id="SourceText">
          {this.state.SourceTextLoadingState ? (
            <span
              id="SourceTextItem"
              onMouseUp={() => this.GetSelectedText()}
              dangerouslySetInnerHTML={{ __html: this.state.SourceText }}
            />
          ) : (
            <Icon type="loading" style={{ fontSize: 24 }} spin />
          )}
        </div>
        <div className="TableComponent">
          {this.state.KwTotalLoadingState ? <KwHistoryTable dataSource={this.state.KwTotal} /> : null}
          {this.state.jiebaLoadingState ? <JiebaTable dataSource={this.state.jiebaList} /> : null}
        </div>
      </div>
    );
  }
}

export default KeyWordIdentify;
