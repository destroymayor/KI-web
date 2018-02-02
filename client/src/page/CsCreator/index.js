import React, { Component } from "react";
import "./index.css";

//import FireBaseApp from "../../db/firebaseAPI";
import { Button, Collapse, Input, Select, Table } from "antd";
// Select component option
const Option = Select.Option;
// Panel component option
const Panel = Collapse.Panel;

class CsCreator extends Component {
  state = {
    //切換Cs選擇模式
    CsSwitchMode: true,
    //Css select多選
    CsAdd_CustomizeSelectComponent: [],
    //添加Cs-Kw按鈕狀態
    AddCs_KwState: true,
    //Cs Select Component
    CsAdd_SelectList: [],
    // 選擇Cs後的 List
    SelectCsList: [],
    // 選擇pKw後的 List
    SelectPkwList: [],
    //cs kw total item
    CsCreator_TotalItem: [],
    //table添加至db的button state
    Cs_KwListToDataBaseBtnState: true,
    // 選擇pkw時參看原文章
    ArticlePreview:
      "中央社記者韋樞台北2018年1月25日電）股市追漲不追跌的特性同樣適用於房市，房仲發現，新北重劃區降價換成交如同吸嗎啡，初期奏效，但降價策略不停止，在投資人不追跌的情形下買氣必停，土城暫緩發展區要提高警覺。 在房市一片讓利風下，降價才有來客數，有來客數才有機會成交，似乎讓利成了房市成交的唯一藥方，於是新屋餘屋多的重劃區多用降價換成交策略。 中信房屋副總劉天仁表示，股市的特性就是追漲不追跌，房市降價換成交的銷售策略如同雙面刃，更像嗎啡。初期銷售必然亮眼，但若降價策略不適可而止，同業勢必打價格戰，更將造成消費者觀望氣氛，買氣反而會驟然停滯，市場陷入觀望。 劉天仁發現，新北市板橋江翠北側重劃區及土城暫緩發展重劃區為新北市兩大熱門重劃區，部份建案銷售情況不錯，但往往只有降價取量，也就是區域內第一個降價案奏效後，其他建案勢必跟進，否則無法銷售，若開出比第一案更低價，市場就會陷入無底的價格戰，長期的價格戰無異於嗎啡，購屋人麻痺了，市場自然陷入觀望停滯。 劉天仁提醒，這兩個重劃區的推案潮應會從現在起延續到第3季以後，若建商或代銷業者的銷售策略不改變，預料土城暫緩發展重劃區空殺空的情況會在第2季前就會發生，屆時將發生買氣停滯的情況。 至於板橋江翠北側重劃區從2016年7月起經歷一年多的空殺空洗禮，目前此區預售屋價格甚至演變成不同區位，但卻是均一價的情況，所幸價格不再競跌，近期買氣才稍有回升。",
    ArticlePreviewLoadingState: false
  };

  componentDidMount() {
    this.Fetch_JiebaList();
  }

  async Fetch_JiebaList() {
    const pKwSelectLists = [];
    try {
      const fetchData = await fetch("/jieba?page=1");
      const responseData = await fetchData.json();
      //多選component
      responseData.forEach((value, index) => {
        pKwSelectLists.push(<Option key={value.word}>{value.word}</Option>);

        this.state.CsAdd_SelectList.push(<Option key={parseInt(index + 1, 10)}>{`Cs${index + 1}`}</Option>);

        this.setState({
          CsAdd_CustomizeSelectComponent: pKwSelectLists
        });
      });
    } catch (error) {}
  }

  //Cs 選擇handle
  handleCsSelect = value => {
    this.setState({ SelectCsList: value.label, ArticlePreviewLoadingState: false });
  };

  // handle參看原文章
  handlePkwSelect = value => {
    //參看原文章
    this.setState({
      ArticlePreview: this.state.ArticlePreview.replace(
        new RegExp(value, "g"),
        val => `<span style="background:#2897ff;">${val}</span>`
      ),
      ArticlePreviewLoadingState: true
    });
  };

  //total 選擇handle
  handleAddCs_Kw = () => {
    this.state.CsCreator_TotalItem.push({ Cs: this.state.SelectCsList, Kw: this.state.SelectPkwList });
    this.setState({
      ArticlePreview: this.state.ArticlePreview.replace(/<[^>]*>/g, ""),
      ArticlePreviewLoadingState: false,
      AddCs_KwState: true,
      Cs_KwListToDataBaseBtnState: false
    });
  };

  render() {
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`);
      }
    };

    return (
      <div className="CsCreator-Index">
        <div className="CsCreator-Item">
          <div className="CsCreator-Add">
            <div className="CsCreator-AddItem">
              <Button
                type="primary"
                icon={this.state.CsSwitchMode ? "profile" : "edit"}
                onClick={() => {
                  this.setState({
                    CsSwitchMode: !this.state.CsSwitchMode,
                    AddCs_KwState: true,
                    SelectCsList: ""
                  });
                }}
              >
                {this.state.CsSwitchMode ? "選擇Cs" : "自定義Cs"}
              </Button>
              {this.state.CsSwitchMode ? (
                <Select
                  style={{ width: 150 }}
                  className="CsCreator-SelectComponent"
                  labelInValue
                  onChange={this.handleCsSelect}
                >
                  {this.state.CsAdd_SelectList}
                </Select>
              ) : (
                <Input
                  style={{ width: 150, marginLeft: 10 }}
                  placeholder="Cs"
                  value={this.state.SelectCsList}
                  onChange={value =>
                    this.setState({
                      SelectCsList: value.target.value
                    })
                  }
                />
              )}
            </div>
            <div className="CsCreator-AddItem">
              <Select
                style={{ width: "50%" }}
                className="CsCreator-pKwSelectComponent"
                allowClear={true}
                mode="tags"
                placeholder="pKw"
                onChange={value => {
                  // pkw select list
                  this.setState({ SelectPkwList: value, AddCs_KwState: false });
                }}
                onDeselect={value => {
                  //標記顏色復原
                  this.setState({
                    ArticlePreview: this.state.ArticlePreview.replace(
                      new RegExp(`<span[^>]*>[${value}]+</span>`, "g"),
                      value
                    )
                  });
                }}
                onSelect={this.handlePkwSelect}
              >
                {this.state.CsAdd_CustomizeSelectComponent}
              </Select>
              <Button
                disabled={this.state.AddCs_KwState}
                className="CsCreator-AddBtn"
                onClick={this.handleAddCs_Kw}
              >
                添加Cs_Kw
              </Button>
            </div>
          </div>
          <div className="CsCreator-ItemTableComponent">
            <Table
              className="CsCreator-TableComponent"
              dataSource={this.state.CsCreator_TotalItem}
              size={"small"}
              rowSelection={rowSelection}
              pagination={false}
              rowKey={key => key.Cs}
              footer={() => <Button disabled={this.state.Cs_KwListToDataBaseBtnState}>全部添加至DB</Button>}
              columns={[
                {
                  title: "Cs",
                  dataIndex: "Cs",
                  key: "Cs",
                  width: 100
                },
                {
                  title: "Kw",
                  dataIndex: "Kw",
                  key: "Kw",
                  render: Kw => <span>{`${Kw}`}</span>
                }
              ]}
            />
          </div>
        </div>
        <div className="CsCreator-ArticlePreviewComponent">
          {this.state.ArticlePreviewLoadingState ? (
            <Collapse defaultActiveKey={["1"]}>
              <Panel header="參看第一篇" key="1">
                <span dangerouslySetInnerHTML={{ __html: this.state.ArticlePreview }} />
              </Panel>
            </Collapse>
          ) : null}
        </div>
      </div>
    );
  }
}

export default CsCreator;
