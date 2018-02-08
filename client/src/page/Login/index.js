import React, { Component } from "react";
import "./index.css";
import history from "../RouterHistory";

import Buttons from "../../utils/components/Buttons";
import { Input, Icon, Select } from "antd";
const Option = Select.Option;

class Login extends Component {
  state = {
    Pages: "Login",
    LoginUserName: null,
    LoginPassWord: null,
    LoginDisabledState: true
  };

  handlePageSelect = value => {
    this.setState({
      Pages: value,
      LoginDisabledState: false
    });
  };

  handleLogin = () => {
    switch (this.state.Pages) {
      case "User":
        history.push("/Chat");
        break;
      case "Trainer":
        history.push("/Login");
        break;
      case "Expert":
        history.push("/Ki");
        break;
      default:
        break;
    }
  };

  render() {
    return (
      <div className="Login">
        <Select
          placeholder={"選擇使用者"}
          ref="SelectPage"
          style={{ width: 150 }}
          onChange={this.handlePageSelect}
        >
          <Option value={"User"}>User</Option>
          <Option value={"Trainer"}>Trainer</Option>
          <Option value={"Expert"}>Expert</Option>
        </Select>
        <div className={"Login-Input"}>
          <Input
            prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
            value={this.state.LoginUserName}
            onChange={e => {
              this.setState({ LoginUserName: e.target.value });
            }}
            placeholder="Username"
          />
          <Input
            prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
            type="password"
            value={this.state.LoginPassWord}
            onChange={e => {
              this.setState({ LoginPassWord: e.target.value });
            }}
            placeholder="Password"
          />
        </div>
        <div className="Login-Btn">
          <Buttons disabled={this.state.LoginDisabledState} Text={"登入"} onClick={this.handleLogin} />
        </div>
      </div>
    );
  }
}

export default Login;
