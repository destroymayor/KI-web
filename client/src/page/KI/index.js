import React, { Component } from "react";
import "./index.css";

//載入ant design 組件庫
import { Icon, Select, Table } from "antd";

//載入firebase api
import FireBaseApp from "../../db/firebaseAPI";

import Buttons from "../../utils/components/Buttons";

//Select component option
const Option = Select.Option;

export default class KI extends Component {
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
    //復原Ur標註
    UrTagRecovery: "",
    //人工標記集合
    GetSelectedTextList: [],
    //kw參數的List
    KwTotal: [],
    KwTotalLoadingState: false,
    //讀取歷史kw庫按鈕狀態
    FetchKeyWordHistoryDisabledState: true
  };

  componentDidMount() {
    //初始化firebase
    this.ref = FireBaseApp.database();
    //連接SourceText庫
    this.ref.ref("SourceText/").on("value", this._FetchSourceText);
  }

  componentWillUnmount() {
    if (this.ref) {
      //斷開firebase
      this.ref.ref("SourceText/").off("value", this._FetchSourceText);
      this.ref.ref("/KeyWord").off("value", this._FetchKeyWordHistory);
    }
  }

  //讀取sourceText庫資料
  _FetchSourceText = snapshot => {
    const SourceTextArray = [];
    snapshot.forEach(val => {
      SourceTextArray.push(val.val());
    });

    //select option
    SourceTextArray.forEach((value, index) => {
      this.state.SourceTextSelectItem.push(
        <Option key={index} value={value}>
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
      SourceText: SourceTextArray[0],
      //標出tx庫位置的集合
      SourceTextLocalTags: SourceTextArray[0]
    });
  };

  //讀取歷史kw庫資料
  _FetchKeyWordHistory = async snapshot => {
    const KwHistoryArray = [];
    await snapshot.forEach(val => {
      KwHistoryArray.push(val.val());
    });

    await this.setState({
      //儲存kw歷史庫
      KwHistory: KwHistoryArray,
      //讀取歷史kw庫並標出顏色(綠色)
      SourceText: this.state.SourceText.replace(
        new RegExp(KwHistoryArray.join("|"), "g"),
        val => `<span style="color:#00A600;">${val}</span>`
      ),
      //close 讀取歷史kw庫按鈕
      FetchKeyWordHistoryDisabledState: true,
      //close loading 按鈕
      KwTotalLoadingState: true
    });

    //kw頻率及位置
    await this.state.KwHistory.forEach((value, index) => {
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
    await this.setState({
      KwTotal: this.state.KwTotal.filter(value => {
        return value.keyword !== null;
      })
    });
  };

  async Fetch_JiebaList() {
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

      this.setState({
        jiebaLoadingState: true,
        FetchjiebaListDisabledState: true
      });
    } catch (error) {}
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
      FetchKeyWordHistoryDisabledState: false,
      //open jieba 按鈕狀態
      FetchjiebaListDisabledState: false
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
  InsertTextTag() {
    this.ref.ref("MC_pKw/").push({ pKw1: this.state.GetSelectedTextList });
  }

  //復原Ur選取標記
  RemoveTextTagRange() {
    this.setState({
      SourceText: this.state.SourceText.replace(
        this.state.UrTagRecovery,
        `<span style="backgroundColor:rgba(255,255,255,0);">${this.state.UrTagRecovery}</span>`
      )
    });
  }

  render() {
    return (
      <div className="Ki">
        <h3>SourceText庫</h3>
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
        <div className="ButtonItem">
          <Buttons
            disabled={this.state.FetchKeyWordHistoryDisabledState}
            Text={"讀取歷史Kw庫"}
            onClick={() => {
              this.ref.ref("/KeyWord").on("value", this._FetchKeyWordHistory);
            }}
          />
          <Buttons
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
          {this.state.KwTotalLoadingState ? (
            <Table
              dataSource={this.state.KwTotal}
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
          ) : null}

          {this.state.jiebaLoadingState ? (
            <Table
              dataSource={this.state.jiebaList}
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
          ) : null}
        </div>
      </div>
    );
  }
}
