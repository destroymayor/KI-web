import React, { Component } from "react";
import "./index.css";

//import FireBaseApp from "../../db/firebaseAPI";
import { Button, Input, Select, Table } from "antd";

//Select component option
const Option = Select.Option;

export default class CsCreator extends Component {
  state = {
    // Add Cs_Kw item
    Cs_InputText: null,
    CsAdd_SelectComponent: [],
    // select pkw
    SelectpKwList: [],
    //table select component
    TableItemSelect: [],
    TableLoadingState: true
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

        let CsNumber = parseInt(index + 1, 10);
        this.state.TableItemSelect.push({
          key: CsNumber,
          Cs: "Cs" + CsNumber,
          KwIdentify: (
            <Select
              className="KI_selectComponent"
              allowClear={true}
              mode="tags"
              style={{ width: "100%" }}
              placeholder="pKw"
              onChange={this.HandleSelect}
            >
              {pKwSelectLists}
            </Select>
          )
        });

        this.setState({ TableLoadingState: false, CsAdd_SelectComponent: pKwSelectLists });
      });
    } catch (error) {}
  }

  HandleSelect = value => {
    this.setState({ SelectpKwList: value });
    console.log(value);
  };

  handleAddCs_Kw = () => {};

  render() {
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
        <div className="KI_Item">
          <div className="KI_Add">
            <Button className="add-btn" onClick={this.handleAddCs_Kw}>
              添加自訂義Cs_Kw
            </Button>
            <Input
              placeholder="Cs"
              style={{ width: 100, marginRight: 10, marginLeft: 10 }}
              value={this.state.Cs_InputText}
              onChange={value => this.setState({ Cs_InputText: value.target.value })}
            />
            <Select
              style={{ width: "100%" }}
              className="KI_selectComponent"
              allowClear={true}
              mode="tags"
              placeholder="pKw"
              onChange={value => {
                console.log(value);
              }}
            >
              {this.state.CsAdd_SelectComponent}
            </Select>
          </div>
          <div className="KI_ItemTableComponent">
            <Table
              className="KI_tableComponent"
              rowSelection={rowSelection}
              pagination={false}
              loading={this.state.TableLoadingState}
              columns={[
                {
                  title: "Cs",
                  dataIndex: "Cs",
                  key: "Cs",
                  width: 100
                },
                {
                  title: "KwIdentify",
                  dataIndex: "KwIdentify",
                  key: "KwIdentify"
                }
              ]}
              dataSource={this.state.TableItemSelect}
            />
          </div>
        </div>
      </div>
    );
  }
}
