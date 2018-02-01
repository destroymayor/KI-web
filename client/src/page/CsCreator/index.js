import React, { Component } from "react";
import "./index.css";

//import FireBaseApp from "../../db/firebaseAPI";
import { Button, Input, Select, Table } from "antd";

//Select component option
const Option = Select.Option;

class CsCreator extends Component {
  state = {
    // Add Cs_Kw item
    Cs_InputText: null,
    CsAdd_CustomizeSelectComponent: [],
    //Cs Select Component
    CsAdd_SelectList: [],
    // 選擇Cs後的 List
    SelectCsList: [],
    // 選擇pKw後的 List
    SelectPkwList: [],
    //cs kw total item
    CsCreator_TotalItem: [],
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

        this.state.CsAdd_SelectList.push(<Option key={parseInt(index + 1, 10)}>{`Cs${index + 1}`}</Option>);

        this.setState({
          CsAdd_CustomizeSelectComponent: pKwSelectLists
        });
      });
    } catch (error) {}
  }

  //Cs 選擇handle
  handleCsSelect = value => {
    this.setState({ SelectCsList: value.label });
  };

  //pkw 選擇handle
  handlePkwSelect = value => {
    this.setState({ SelectPkwList: value });
  };

  //total 選擇handle
  handleAddCs_Kw = () => {
    this.state.CsCreator_TotalItem.push({ Cs: this.state.SelectCsList, Kw: this.state.SelectPkwList });
    this.setState({ TableLoadingState: false });
    console.log(this.state.SelectCsList, this.state.SelectPkwList, this.state.CsCreator_TotalItem);
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
            <Select
              style={{ width: "30%" }}
              className="CsCreator-SelectComponent"
              labelInValue
              placeholder={"選擇Cs"}
              onChange={this.handleCsSelect}
            >
              {this.state.CsAdd_SelectList}
            </Select>
            <Input
              placeholder="Cs"
              style={{ width: 100, marginRight: 10, marginLeft: 10 }}
              value={this.state.Cs_InputText}
              onChange={value => this.setState({ Cs_InputText: value.target.value })}
            />
            <Select
              style={{ width: "100%" }}
              className="CsCreator-pKwSelectComponent"
              allowClear={true}
              mode="tags"
              placeholder="pKw"
              onChange={this.handlePkwSelect}
            >
              {this.state.CsAdd_CustomizeSelectComponent}
            </Select>
            <Button className="CsCreator-AddBtn" onClick={this.handleAddCs_Kw}>
              添加Cs_Kw
            </Button>
          </div>
          <div className="CsCreator-ItemTableComponent">
            <Table
              className="CsCreator-TableComponent"
              size={"small"}
              rowSelection={rowSelection}
              pagination={false}
              rowKey={key => key.Cs}
              loading={this.state.TableLoadingState}
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
              dataSource={this.state.CsCreator_TotalItem}
              footer={() => <Button>全部添加至DB</Button>}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default CsCreator;
