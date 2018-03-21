import axios from "axios";
import { Button, Collapse, List, Icon, Select, message, Spin, Popover, Table } from "antd";

import React, { Component } from "react";
import "./index.css";

import Menu from "../../utils/Menu/index";

const Option = Select.Option; // Select component option
const Panel = Collapse.Panel; // Panel component option

class CsCreator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      SourceTextSelectItem: [],
      SourceTextSelectedPlaceholder: "",
      CsAdd_CustomizeSelectComponent: [], // Cs select多選 list
      FetchJiebaListState: true,
      Pkw_MultipleList: [], // pKw List
      Pkw_SelectList: [], // pkw 選擇後的list
      Pkw_SelectItemState: true,
      CsAdd_SelectList: [], // Cs Select Component option
      SelectCsLv: "", // 選擇Cs-Lv
      CsCreator_TotalItem: [], //cs kw total item
      Cs_KwListToDataBaseBtnState: true, //table 添加至db的 button state
      ArticlePreviewList: [], // 選擇pkw時參看原文章
      ArticlePreview: "",
      ArticlePreviewLoadingState: false,
      ArticlePreviewRemoveTag: null
    };

    this.CancelToken = axios.CancelToken.source();
  }

  componentDidMount() {
    this._FetchSourceText();
  }

  componentWillUnmount() {
    if (this.CancelToken) {
      this.CancelToken.cancel("CsCreator Component Is Unmounting");
    }
  }

  //讀取sourceText庫資料
  _FetchSourceText() {
    axios
      .get("/sourcetext", { cancelToken: this.CancelToken.token })
      .then(response => {
        //select option
        response.data.forEach((value, index) => {
          this.state.SourceTextSelectItem.push(
            <Option key={index} value={index + 1}>
              {value.content}
            </Option>
          );
          this.state.ArticlePreviewList.push(value.content); //參看原文章list
        });
      })
      .catch(error => {
        console.log("fetch source text", error);
        message.error("無法連接，請稍後再試!");
      });
  }

  Fetch_JiebaList(pageNumber) {
    const pKwSelectLists = [];
    this.setState({ FetchJiebaListState: false });
    axios
      .get("/jieba?page=" + pageNumber, { cancelToken: this.CancelToken.token })
      .then(response => {
        // 多選component
        response.data.forEach(value => {
          this.state.Pkw_MultipleList.push(value.word); // Pkw MultipleList
          this.state.CsAdd_SelectList.push(value.word); //cs select list
        });
        this.setState({
          FetchJiebaListState: true,
          CsAdd_CustomizeSelectComponent: pKwSelectLists, // pkw select list state
          ArticlePreview: this.state.ArticlePreviewList[pageNumber - 1] //參看原文章篇數
        });
      })
      .catch(error => {
        console.log("fetch jieba list", error);
        message.error("無法連接，請稍後再試!");
      });
  }

  // handle event //
  // select source tx
  handleSelectSourceText = selectValue => {
    this.setState({
      CsAdd_SelectList: [],
      Pkw_MultipleList: [],
      Pkw_SelectList: [],
      FetchJiebaListState: false,
      ArticlePreviewLoadingState: false
    });
    this.Fetch_JiebaList(selectValue.key);
  };

  // pkw multiple add or remove
  handlePkwMultiple = item => {
    this.setState({ Pkw_SelectItemState: !this.state.Pkw_SelectItemState });
    return this.state.Pkw_SelectList.indexOf(item) !== -1
      ? this.setState({
          Pkw_SelectList: this.state.Pkw_SelectList.filter(val => val !== item)
        })
      : this.state.Pkw_SelectList.push(item);
  };

  // article preview tag color
  ArticlePreviewTagColor(value) {
    const TagStyle = `<em style="background-color:#2897ff;">${value}</em>`;
    if (this.state.ArticlePreview.search(TagStyle) === -1) {
      this.setState({
        ArticlePreview: this.state.ArticlePreview.replace(new RegExp(value, "g"), TagStyle),
        ArticlePreviewLoadingState: true
      });
    }
  }

  // article preview remove tag color
  ArticlePreviewRemoveTagColor(value) {
    const TagStyle = `<em style="background-color:#2897ff;">${value}</em>`;
    if (this.state.ArticlePreview.search(TagStyle) !== -1) {
      this.setState({ ArticlePreview: this.state.ArticlePreview.replace(new RegExp(TagStyle, "g"), value) });
    }
  }

  // total add to table
  handleAddCs_Kw = item => {
    this.state.CsCreator_TotalItem.push({
      index: this.state.CsAdd_SelectList.indexOf(item),
      Cs: item,
      Kw: this.state.Pkw_SelectList
    });
    this.setState({
      CsAdd_SelectList: this.state.CsAdd_SelectList.filter(val => val !== item),
      Pkw_SelectList: [], // 清空已選的pkw list
      Cs_KwListToDataBaseBtnState: false
    });
  };

  // handle event //

  _renderSelectSourceText = () => (
    <React.Fragment>
      <p>選擇文章</p>
      <Select
        className="CsCreator_SelectComponent"
        style={{ width: 400, marginLeft: 10 }}
        autoFocus
        labelInValue
        notFoundContent={<Spin size="small" />}
        placeholder={this.state.SourceTextSelectedPlaceholder}
        onChange={this.handleSelectSourceText}
      >
        {this.state.SourceTextSelectItem}
      </Select>
    </React.Fragment>
  );

  _renderPkwMultipleItem = () => (
    <div className="CsCreator-AddItem">
      <p>pKw</p>
      <List
        id="PkwMultipleItem"
        style={{ width: "100%", padding: 0, height: 300 }}
        header={<p>多選pkw {this.state.FetchJiebaListState ? null : <Icon type="loading" />}</p>}
        bordered
        dataSource={this.state.Pkw_MultipleList}
        renderItem={item => (
          <List.Item style={{ padding: 0 }}>
            <Button
              id="CsCreator-CsItemButton"
              onClick={() => {
                this.handlePkwMultiple(item);
              }}
              onMouseEnter={async () => {
                await this.ArticlePreviewRemoveTagColor(item);
                await this.ArticlePreviewTagColor(item);
              }}
              onMouseLeave={() => {
                this.ArticlePreviewRemoveTagColor(item);
              }}
            >
              {item}
              {this.state.Pkw_SelectList.indexOf(item) === -1 ? null : <Icon style={{ color: "#2897ff" }} type="check" />}
            </Button>
          </List.Item>
        )}
      />
    </div>
  );

  _renderCsItem = () => (
    <div className="CsCreator-AddItem">
      <p>Cs</p>
      <List
        id="CsCreatorList"
        style={{ width: "100%", height: 300 }}
        header={<p>雙擊加入Cs {this.state.FetchJiebaListState ? null : <Icon type="loading" />}</p>}
        bordered
        dataSource={this.state.CsAdd_SelectList}
        renderItem={item => (
          <List.Item style={{ padding: 0 }}>
            <Button
              id="CsCreator-CsItemButton"
              style={{ width: "100%" }}
              onDoubleClick={() => {
                this.handleAddCs_Kw(item);
              }}
            >
              {item}
            </Button>
          </List.Item>
        )}
      />
    </div>
  );

  _renderTotalTable = () => {
    return (
      <Table
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
                  Object.assign(this.state.CsCreator_TotalItem[index], { Lv: text.key });  //合併object to Lv
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
            render: Kw => <span>{`${Kw}`}</span>
          },
          {
            title: "編輯",
            dataIndex: "operation",
            render: (text, record) =>
              this.state.CsCreator_TotalItem.length > 0 ? (
                <Button
                  onClick={() => {
                    this.setState({
                      CsCreator_TotalItem: this.state.CsCreator_TotalItem.filter(item => item.Cs !== record.Cs)
                    });
                    this.state.CsAdd_SelectList.splice(record.index, 0, record.Cs);
                  }}
                  shape="circle"
                  icon="delete"
                />
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
            {this._renderSelectSourceText()}
            <div className="CsCreator-Add">
              {this._renderPkwMultipleItem()}
              {this._renderCsItem()}
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
