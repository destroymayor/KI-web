import React, { Component } from "react";
import "./index.css";

//載入react router組件庫
import { Link } from "react-router-dom";
import history from "../../page/RouterHistory";

//載入ant design 組件庫
import { Menu, Icon } from "antd";
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class Menus extends Component {
  state = {
    RoleSwitch_KeywordIdentifyState: true,
    RoleSwitch_CsCreatorState: true,
    RoleSwitch_Name: "User"
  };

  handleRoleSwitch = value => {
    switch (value.key) {
      case "User":
        history.push("/");
        this.setState({
          RoleSwitch_KeywordIdentifyState: true,
          RoleSwitch_CsCreatorState: true,
          RoleSwitch_Name: value.key
        });
        break;
      case "Trainer":
        this.setState({
          RoleSwitch_KeywordIdentifyState: false,
          RoleSwitch_CsCreatorState: false,
          RoleSwitch_Name: value.key
        });
        break;
      case "Expert":
        this.setState({
          RoleSwitch_KeywordIdentifyState: false,
          RoleSwitch_CsCreatorState: false,
          RoleSwitch_Name: value.key
        });
        break;
      default:
        break;
    }
  };

  render() {
    return (
      <div className="Menu">
        <Menu
          style={{ width: "100%" }}
          mode="horizontal"
          onSelect={this.handleRoleSwitch}
          defaultSelectedKeys={["User"]}
          defaultOpenKeys={["RoleSwitch"]}
        >
          <Menu.Item key="home">
            <Link to="/">
              <Icon type="home" />
              首頁
            </Link>
          </Menu.Item>
          <SubMenu
            key="horizontal"
            title={
              <span>
                <Icon type="user" />
                當前角色 {this.state.RoleSwitch_Name}
              </span>
            }
          >
            <Menu.Item key="User">User</Menu.Item>
            <Menu.Item key="Trainer">Trainer</Menu.Item>
            <Menu.Item key="Expert">Expert</Menu.Item>
          </SubMenu>
          <SubMenu
            key="MenuRouter"
            title={
              <span>
                <Icon type="bars" />
                功能選單
              </span>
            }
          >
            <MenuItemGroup key="MenuItemMain" title="主要功能">
              <Menu.Item disabled={this.state.RoleSwitch_KeywordIdentifyState} key="Ki">
                <Link to="/Ki">Keyword Identify</Link>
              </Menu.Item>
              <Menu.Item disabled={this.state.RoleSwitch_CsCreatorState} key="CsCreator">
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
