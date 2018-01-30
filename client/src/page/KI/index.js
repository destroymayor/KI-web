import React, { Component } from "react";
import logo from "../../utils/logo.svg";
import "./index.css";

import { Icon } from "antd";
import { Link } from "react-router-dom";

//載入下拉組件庫
import Select from "react-select";
import "react-select/dist/react-select.css";

//載入table組件庫
import ReactTable from "react-table";
import "react-table/react-table.css";

import FireBaseApp from "../../db/firebaseAPI";
import Buttons from "../../utils/components/Buttons";

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

    SourceTextArray.forEach((value, index) => {
      this.state.SourceTextSelectItem.push({ value: value, label: index + 1 });
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
        //kw
        Kw: frequencyState ? null : value,
        //出現頻率
        frequency: frequencyState ? null : this.state.SourceText.match(new RegExp(value, "g") || []).length,
        //出現位置字元
        Localtag: frequencyState ? null : this.state.SourceTextLocalTags.indexOf(value)
      });
    });

    //過濾null值
    await this.setState({
      KwTotal: this.state.KwTotal.filter(value => {
        return value.Kw !== null;
      })
    });
  };

  async Fetch_JiebaList() {
    try {
      const fetchJiebaList = await fetch("/jieba?page=" + this.state.SourceTextSelectedOption);
      const responseData = await fetchJiebaList.json();
      responseData.map((value, index) => {
        return this.setState({
          SourceText: this.state.SourceText.replace(
            new RegExp(value.word, "g"),
            val => `<span style="color:#2897ff;">${val}</span>`
          )
        });
      });
      this.setState({
        jiebaList: responseData,
        jiebaLoadingState: true,
        FetchjiebaListDisabledState: true
      });
    } catch (error) {}
  }

  //handle 下拉組件
  HandleSelect = selectValue => {
    this.setState({
      SourceText: selectValue.value,
      SourceTextLocalTags: selectValue.value,
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
      <div className="Index">
        <header className="Index-header">
          <img src={logo} className="Index-logo" alt="logo" />
          <h1 className="Index-title">Kw Identify for Web</h1>
        </header>
        <h3>SourceText庫</h3>
        <div className="SelectComponent">
          <Select
            className="ReactSelect"
            placeholder={this.state.SourceTextSelectedOption}
            value={this.state.SourceTextSelectedOption}
            onChange={this.HandleSelect}
            options={this.state.SourceTextSelectItem}
            autoFocus
          />
        </div>
        <div className="ButtonItem">
          <Link to="/identify">
            <Buttons Text={"identify"} />
          </Link>
          <Buttons
            disabled={this.state.FetchKeyWordHistoryDisabledState}
            Text={"讀取歷史Kw庫"}
            onClick={() => {
              this.ref.ref("/KeyWord").on("value", this._FetchKeyWordHistory);
            }}
          />
          <Buttons
            disabled={this.state.FetchjiebaListDisabledState}
            Text={"讀取pkw庫"}
            onClick={() => {
              this.Fetch_JiebaList();
            }}
          />
          <Buttons
            Text={"新增標記"}
            onClick={() => {
              this.InsertTextTag();
            }}
          />
          <Buttons
            Text={"復原標記"}
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
            <ReactTable
              data={this.state.KwTotal}
              className="kwTable"
              showPagination={false}
              columns={[
                {
                  Header: "Kw",
                  columns: [
                    {
                      Header: "關鍵字",
                      accessor: "Kw"
                    },
                    {
                      Header: "出現頻率",
                      accessor: "frequency"
                    },
                    {
                      Header: "初始位置",
                      accessor: "Localtag"
                    }
                  ]
                }
              ]}
            />
          ) : null}

          {this.state.jiebaLoadingState ? (
            <div>
              <ReactTable
                data={this.state.jiebaList}
                showPagination={false}
                className="pkwTable"
                style={{ width: 300 }}
                columns={[
                  {
                    Header: "pKw",
                    columns: [
                      {
                        Header: "關鍵字",
                        accessor: "word"
                      },
                      {
                        Header: "權重值",
                        accessor: "weight"
                      }
                    ]
                  }
                ]}
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
