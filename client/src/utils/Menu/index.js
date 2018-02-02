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
      <div>
        <Menu mode="inline" defaultSelectedKeys={["User"]} defaultOpenKeys={["RoleSwitch"]}>
          <SubMenu
            key="RoleSwitch"
            title={
              <span>
                <Icon type="user" />
                角色切換
              </span>
            }
          >
            <Menu.Item key="User">User</Menu.Item>
            <Menu.Item key="Trainer">Trainer</Menu.Item>
            <Menu.Item key="Expert">Expert</Menu.Item>
          </SubMenu>
        </Menu>
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
            <Menu.Item key="home">
              <Link to="/">
                <Icon type="home" />
                首頁
              </Link>
            </Menu.Item>
            <MenuItemGroup key="group1" title="主要功能">
              <Menu.Item key="Ki">
                <Link to="/Ki">Keyword Identify</Link>
              </Menu.Item>
              <Menu.Item key="CsCreator">
                <Link to="/CsCreator">CsCreator</Link>
              </Menu.Item>
            </MenuItemGroup>
          </SubMenu>
        </Menu>
      </div>
    );
  }
}

export default Menus;
