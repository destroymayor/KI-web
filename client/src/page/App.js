import React, { Component } from "react";
import logo from "../logo.svg";
import "./App.css";

import { Icon } from "antd";

//載入下拉組件庫
import Select from "react-select";
import "react-select/dist/react-select.css";

import FireBaseApp from "../db/firebaseAPI";
import Buttons from "./components/Buttons";

class App extends Component {
  state = {
    //Loading State
    SourceTextLoadingState: false,
    //下拉組件集合
    SourceTextSelectItem: [],
    //下拉組件初始化String
    SourceTextSelectedOption: "第1篇",
    //讀取tx庫
    SourceText: "",
    //讀取tx字元位置
    SourceTextLocalTags: "",
    //讀取kw歷史庫
    KwHistory: [],
    //復原Ur標註
    UrTagRecovery: "",
    //人工標記集合
    GetSelectedTextList: [],
    //kw參數的List
    KwTotal: [],
    //讀取歷史kw庫按鈕狀態
    FetchKeyWordHistoryDisabledState: true,
    //kw計算頻率按鈕狀態
    CalculateFrequencyDisabledState: true
  };

  componentDidMount() {
    //初始化firebase
    this.ref = FireBaseApp.database();
    //連接SourceText庫
    this.ref.ref("SourceText/").on("value", this._FetchSourceText);
    this.fetch_jieba();
  }

  componentWillUnmount() {
    if (this.ref) {
      //斷開firebase
      this.ref.ref("SourceText/").off("value", this._FetchSourceText);
      this.ref.ref("/KeyWord").off("value", this._FetchKeyWordHistory);
    }
  }

  fetch_jieba() {
    fetch("/jieba?page=1")
      .then(response => {
        response.json();
      })
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        console.log(error);
      });
  }

  //讀取sourceText庫資料
  _FetchSourceText = snapshot => {
    const SourceTextArray = [];
    snapshot.forEach(val => {
      SourceTextArray.push(val.val());
    });

    SourceTextArray.forEach((value, index) => {
      this.state.SourceTextSelectItem.push({ value: value, label: `第${index + 1}篇` });
    });

    this.setState({
      //loading state
      SourceTextLoadingState: true,
      //open 讀取歷史kw庫按鈕
      FetchKeyWordHistoryDisabledState: false,
      SourceText: SourceTextArray[0],
      //標出tx庫位置的集合
      SourceTextLocalTags: SourceTextArray[0]
    });
  };

  //讀取歷史kw庫資料
  _FetchKeyWordHistory = snapshot => {
    const KwHistoryArray = [];
    snapshot.forEach(val => {
      KwHistoryArray.push(val.val());
    });

    this.setState({
      //儲存kw歷史庫
      KwHistory: KwHistoryArray,
      //讀取歷史kw庫並標出顏色(綠色)
      SourceText: this.state.SourceText.replace(
        new RegExp(KwHistoryArray.join("|"), "g"),
        val => `<span style="color:#2897ff;">${val}</span>`
      ),
      //close 讀取歷史kw庫按鈕
      FetchKeyWordHistoryDisabledState: true
    });
  };

  //handle 下拉組件
  HandleSelect = selectValue => {
    this.setState({
      SourceText: selectValue.value,
      SourceTextLocalTags: selectValue.value,
      SourceTextSelectedOption: selectValue.label,
      KwTotal: [],
      //open 讀取kw按鈕狀態
      FetchKeyWordHistoryDisabledState: false
    });
  };

  //計算文章出現kw頻率
  CalculateFrequency() {
    this.state.KwHistory.forEach((value, index) => {
      this.state.KwTotal.push({
        //kw
        Kw: value,
        //出現頻率
        frequency:
          this.state.SourceText.match(new RegExp(value, "g") || []) === null
            ? 0
            : this.state.SourceText.match(new RegExp(value, "g") || []).length,
        //出現位置字元
        Localtag: this.state.SourceTextLocalTags.indexOf(value)
      });
    });

    //close 計算頻率按鈕
    this.setState({ CalculateFrequencyDisabledState: true });
    this.ref.ref("/KeyWord").on("value", this._FetchKeyWordHistory);
  }

  //Ur人工標色
  GetSelectedText() {
    let Selection = window.getSelection().getRangeAt(0);
    let SelectedText = Selection.extractContents();
    let SelectSpan = document.createElement("span");
    SelectSpan.style.backgroundColor = "#FF2D2D";
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
          <h1 className="Index-title">KI for Web</h1>
        </header>
        <h2>SourceText庫</h2>
        <Select
          placeholder={this.state.SourceTextSelectedOption}
          name="form-field-name"
          value={this.state.SourceTextSelectedOption}
          onChange={this.HandleSelect}
          options={this.state.SourceTextSelectItem}
          autoFocus
        />

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

        <Buttons
          disabled={this.state.FetchKeyWordHistoryDisabledState}
          Text={"讀取Kw庫"}
          onClick={() => {
            this.ref.ref("/KeyWord").on("value", this._FetchKeyWordHistory);
            this.setState({ CalculateFrequencyDisabledState: false });
          }}
        />
        <Buttons
          disabled={this.state.CalculateFrequencyDisabledState}
          Type={"Default"}
          Text={"Kw重複頻率及位置"}
          onClick={() => {
            this.CalculateFrequency();
          }}
        />

        <div>
          <h2>Kw庫</h2>
          <ul id="KwItem">
            {this.state.KwTotal.map((val, index) => (
              <li key={index}>
                {val.frequency > 0 ? (
                  <span>
                    {val.Kw}
                    <span style={{ color: val.frequency > 0 ? "#2897ff" : "#222222" }}>
                      {` >出現${val.frequency}次  ${
                        val.Localtag !== -1 ? `，初始位置在第${val.Localtag}字元` : ""
                      }`}
                    </span>
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>

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
    );
  }
}

export default App;
