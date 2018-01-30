import React, { Component } from "react";
import logo from "../../utils/logo.svg";
import "./index.css";

//import FireBaseApp from "../../db/firebaseAPI";
import { Select, Table } from "antd";

//Select component option
const Option = Select.Option;

export default class Identify extends Component {
  state = {
    //Table config
    colums: [
      {
        title: "Cs",
        dataIndex: "Cs",
        key: "Cs"
      },
      {
        title: "KwIdentify",
        dataIndex: "KwIdentify",
        key: "KwIdentify"
      }
    ],
    KwSelectDisabled: true,
    //pKwList
    pKwList: [],
    // select pkw
    SelectpKwList: []
  };

  componentDidMount() {
    this.Fetch_JiebaList();
  }

  async Fetch_JiebaList() {
    const pKwLists = [];
    try {
      const fetchData = await fetch("/jieba?page=1");
      const responseData = await fetchData.json();

      //多選component
      responseData.forEach((value, index) => {
        pKwLists.push(<Option key={value.word}>{value.word}</Option>);
      });
      this.setState({ pKwList: pKwLists });
    } catch (error) {}
  }

  HandleSelect = value => {
    this.setState({ SelectpKwList: value });
    console.log(value);
  };

  render() {
    const data = [
      {
        key: 1,
        Cs: "Cs1",
        KwIdentify: this.state.SelectpKwList.map((value, index) => {
          return <span key={index}>{value} , </span>;
        })
      },
      {
        key: 2,
        Cs: "Cs2",
        KwIdentify: ""
      },
      {
        key: 3,
        Cs: "Cs3",
        KwIdentify: ""
      },
      {
        key: 4,
        Cs: "Cs4",
        KwIdentify: ""
      },
      {
        key: 5,
        Cs: "Cs5",
        KwIdentify: ""
      }
    ];

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`);
        this.setState({
          KwSelectDisabled: false
        });
      },
      type: "radio"
    };

    return (
      <div className="KI_index">
        <header className="Index-header">
          <img src={logo} className="Index-logo" alt="logo" />
          <h1 className="Index-title">Kw Identify for Web</h1>
        </header>
        <div className="KI_Item">
          <div className="KI_ItemTableComponent">
            <Table
              className="KI_tableComponent"
              rowSelection={rowSelection}
              pagination={false}
              columns={this.state.colums}
              dataSource={data}
            />
          </div>
          <div className="KI_ItemSelectComponent">
            <p>選擇pKw</p>
            <Select
              className="KI_selectComponent"
              allowClear={true}
              mode="tags"
              style={{ width: "50%" }}
              placeholder="pKw"
              disabled={this.state.KwSelectDisabled}
              onChange={this.HandleSelect}
            >
              {this.state.pKwList}
            </Select>
          </div>
        </div>
      </div>
    );
  }
}
