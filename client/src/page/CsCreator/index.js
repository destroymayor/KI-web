import axios from "axios";
import { Button, Collapse, Icon, Input, Select, message, Spin, Popover, Popconfirm, Table } from "antd";

import React, { Component } from "react";
import "./index.css";

import Menu from "../../utils/Menu/index";
// Select component option
const Option = Select.Option;
// Panel component option
const Panel = Collapse.Panel;

class CsCreator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      SourceTextSelectItem: [],
      SourceTextSelectedPlaceholder: "",
      // 切換Cs選擇模式
      CsSwitchMode: true,
      // Cs select多選 list
      CsAdd_CustomizeSelectComponent: [],
      // 添加Cs-Kw按鈕狀態
      AddCs_KwState: true,
      // Cs Select Component option
      CsAdd_SelectList: [],
      // 選擇Cs後的 List
      SelectCsList: "",
      // 選擇pKw後的 List
      SelectPkwList: [],
      // 選擇Cs-Lv
      SelectCsLv: "",
      //cs kw total item
      CsCreator_TotalItem: [],
      //table添加至db的button state
      Cs_KwListToDataBaseBtnState: true,
      // 選擇pkw時參看原文章
      ArticlePreviewList: [],
      ArticlePreview: "",
      ArticlePreviewLoadingState: false,
      ArticlePreviewRemoveTag: null
    };
  }

  componentDidMount() {
    this._FetchSourceText();
  }

  //讀取sourceText庫資料
  _FetchSourceText() {
    axios
      .get("/sourcetext")
      .then(response => {
        //select option
        response.data.forEach((value, index) => {
          this.state.SourceTextSelectItem.push(
            <Option key={index} value={index + 1}>
              {value.content}
            </Option>
          );
          //參看原文章list
          this.state.ArticlePreviewList.push(value.content);
        });
      })
      .catch(error => {
        console.log("fetch source text", error);
        message.error("無法連接，請稍後再試!");
      });
  }

  ArticlePreviewTagColor(value) {
    const TagStyle = `<em style="background-color:#2897ff;">${value}</em>`;
    if (this.state.ArticlePreview.search(TagStyle) === -1) {
      this.setState({
        ArticlePreview: this.state.ArticlePreview.replace(new RegExp(value, "g"), TagStyle),
        ArticlePreviewLoadingState: true
      });
    }
  }

  ArticlePreviewRemoveTagColor(value) {
    const TagStyle = `<em style="background-color:#2897ff;">${value}</em>`;
    if (this.state.ArticlePreview.search(TagStyle) !== -1) {
      this.setState({ ArticlePreview: this.state.ArticlePreview.replace(new RegExp(TagStyle, "g"), value) });
    }
  }

  Fetch_JiebaList(pageNumber) {
    const pKwSelectLists = [];
    axios
      .get("/jieba?page=" + pageNumber)
      .then(response => {
        // 多選component
        response.data.forEach((value, index) => {
          pKwSelectLists.push(
            <Option
              onMouseEnter={async value => {
                await this.ArticlePreviewRemoveTagColor(this.state.ArticlePreviewRemoveTag);
                await this.ArticlePreviewTagColor(value.key);
              }}
              onMouseLeave={value => {
                this.ArticlePreviewRemoveTagColor(value.key);
                this.setState({ ArticlePreviewRemoveTag: value.key });
              }}
              key={value.word}
            >
              {value.word}
            </Option>
          );

          //cs select list
          this.state.CsAdd_SelectList.push(<Option key={parseInt(index + 1, 10)}>{value.word}</Option>);
        });

        this.setState({
          // pkw select list state
          CsAdd_CustomizeSelectComponent: pKwSelectLists,
          //參看原文章篇數
          ArticlePreview: this.state.ArticlePreviewList[pageNumber - 1]
        });
      })
      .catch(error => {
        console.log("fetch jieba list", error);
        message.error("無法連接，請稍後再試!");
      });
  }

  //handle select source tx
  handleSelectSourceText = selectValue => {
    this.setState({
      CsAdd_SelectList: [],
      SelectCsList: "",
      ArticlePreviewLoadingState: false
    });
    this.Fetch_JiebaList(selectValue.key);
  };

  //total 選擇handle
  handleAddCs_Kw = () => {
    this.state.CsCreator_TotalItem.push({
      Cs: this.state.SelectCsList,
      Kw: this.state.SelectPkwList
    });
    this.setState({
      ArticlePreviewLoadingState: false,
      AddCs_KwState: true,
      Cs_KwListToDataBaseBtnState: false
    });
  };

  _renderSelectSourceText = () => (
    <div className="CsCreator-AddItem">
      <div>選擇文章</div>
      <Select
        className="CsCreator_SelectComponent"
        style={{ width: 300, marginLeft: 10 }}
        labelInValue
        notFoundContent={<Spin size="small" />}
        placeholder={this.state.SourceTextSelectedPlaceholder}
        onChange={this.handleSelectSourceText}
      >
        {this.state.SourceTextSelectItem}
      </Select>
    </div>
  );

  _renderPkwSelectItem = () => (
    <div className="CsCreator-AddItem">
      <div>pKw</div>
      <Select
        style={{ width: "87%", marginLeft: 10 }}
        className="CsCreator-pKwSelectComponent"
        allowClear={true}
        mode="tags"
        notFoundContent={<Spin size="small" />}
        onChange={value => {
          // pkw select list
          this.setState({ SelectPkwList: value });
        }}
      >
        {this.state.CsAdd_CustomizeSelectComponent}
      </Select>
    </div>
  );

  _renderCsInputItem = () => (
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
        {!this.state.CsSwitchMode ? "選擇Cs" : "自定義Cs"}
      </Button>
      {!this.state.CsSwitchMode ? (
        <Select
          style={{ width: "100%", marginLeft: 10 }}
          className="CsCreator-SelectComponent"
          labelInValue
          notFoundContent={<Spin size="small" />}
          onChange={value => {
            //選擇Cs
            this.setState({
              SelectCsList: value.label,
              AddCs_KwState: false
            });
          }}
        >
          {this.state.CsAdd_SelectList}
        </Select>
      ) : (
        <Input
          style={{ width: "100%", marginLeft: 10 }}
          placeholder="Cs"
          value={this.state.SelectCsList}
          onChange={value =>
            this.setState({
              //自定義Cs
              SelectCsList: value.target.value,
              AddCs_KwState: false
            })
          }
        />
      )}
    </div>
  );

  _renderTotalTable = () => {
    return (
      <Table
        className="CsCreator-TableComponent"
        dataSource={this.state.CsCreator_TotalItem}
        size={"small"}
        pagination={false}
        rowKey={key => key.Cs}
        footer={() => <Button disabled={this.state.Cs_KwListToDataBaseBtnState}>確認全部加入</Button>}
        columns={[
          {
            title: (
              <Popover
                placement={"bottom"}
                title={"說明"}
                content={
                  <div>
                    <p>sX → 不是Kw</p>
                    <p>sI → 口語Kw</p>
                    <p>iW → 通用Kw</p>
                    <p>tS → 特定Kw</p>
                  </div>
                }
              >
                Cs-Lv <Icon type="question-circle" />
              </Popover>
            ),
            dataIndex: "Lv",
            key: "Lv",
            width: 80,
            render: (text, record, index) => (
              <Select
                style={{ width: 70 }}
                className="CsCreator-SelectComponent"
                labelInValue
                onChange={text => {
                  //合併object to Lv
                  Object.assign(this.state.CsCreator_TotalItem[index], { Lv: text.key });
                }}
              >
                <Option key={"sX"}>{"sX"}</Option>
                <Option key={"sI"}>{"sI"}</Option>
                <Option key={"iW"}>{"iW"}</Option>
                <Option key={"tS"}>{"tS"}</Option>
              </Select>
            )
          },
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
            width: 320,
            render: (Kw, record) => <span>{`${Kw}`}</span>
          },
          {
            title: "編輯",
            dataIndex: "operation",
            render: (text, record) =>
              this.state.CsCreator_TotalItem.length > 0 ? (
                <Popconfirm
                  title="確定要刪除此項?"
                  okText="確定"
                  cancelText="取消"
                  onConfirm={key => {
                    this.setState({
                      CsCreator_TotalItem: this.state.CsCreator_TotalItem.filter(
                        item => item.Cs !== record.Cs
                      )
                    });
                  }}
                >
                  <Button shape="circle" icon="delete" />
                </Popconfirm>
              ) : null
          }
        ]}
      />
    );
  };

  render() {
    return (
      <div className="CsCreator-Index">
        <Menu renderPage="Expert" />
        <div className="CsCreator-IndexItem">
          <div className="CsCreator-Item">
            <div className="CsCreator-Add">
              {this._renderSelectSourceText()}
              {this._renderPkwSelectItem()}
              {this._renderCsInputItem()}
              <Button
                disabled={this.state.AddCs_KwState}
                className="CsCreator-AddBtn"
                onClick={this.handleAddCs_Kw}
              >
                添加
              </Button>
            </div>
            <div className="CsCreator-ItemTableComponent">{this._renderTotalTable()}</div>
          </div>
          <div className="CsCreator-ArticlePreviewComponent">
            {this.state.ArticlePreviewLoadingState ? (
              <Collapse defaultActiveKey={["1"]}>
                <Panel header="參看原文章" key="1">
                  <div dangerouslySetInnerHTML={{ __html: this.state.ArticlePreview }} />
                </Panel>
              </Collapse>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default CsCreator;
