import React, { Component } from "react";

//載入react router組件庫
import { Link } from "react-router-dom";

//載入ant design 組件庫
import { Menu, Icon } from "antd";
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class Menus extends Component {
  render() {
    return (
      <Menu mode="vertical">
        <SubMenu
          key="MenuRouter"
          title={
            <span>
              <Icon type="bars" />
              功能選單
            </span>
          }
        >
          <Menu.Item key="1">
            <Link to="/">
              <Icon type="home" />
              首頁
            </Link>
          </Menu.Item>
          <MenuItemGroup key="group1" title="主要">
            <Menu.Item key="2">
              <Link to="/Ki">Keyword Identify</Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/CsCreator">CsCreator</Link>
            </Menu.Item>
          </MenuItemGroup>
        </SubMenu>
      </Menu>
    );
  }
}

export default Menus;
