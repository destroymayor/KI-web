import React, { Component } from "react";

//載入react router組件庫
import { Link } from "react-router-dom";

//載入ant design 組件庫
import { Menu } from "antd";
const SubMenu = Menu.SubMenu;

export default class Menus extends Component {
  render() {
    return (
      <Menu mode="vertical" style={{ backgroundColor: "#fcfcfc" }}>
        <SubMenu key="MenuRouter" title={<span>功能選單</span>}>
          <Menu.Item key="1">
            <Link to="/Ki">Keyword Identify</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/CsCreator">CsCreator</Link>
          </Menu.Item>
        </SubMenu>
      </Menu>
    );
  }
}
