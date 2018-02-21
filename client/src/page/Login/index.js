import { Button, Form, Input, Icon, Select } from "antd";

import React, { Component } from "react";
import "./index.css";
import history from "../RouterHistory";

const FormItem = Form.Item;
const Option = Select.Option;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      PageName: "",
      LoginUserName: null,
      LoginPassWord: null
    };
  }

  componentDidMount() {
    this.props.form.validateFields();
  }

  handlePageSelect = value => {
    this.setState({ PageName: value });
  };

  handleLoginSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          LoginUserName: values.userName,
          LoginPassWord: values.password
        });
        switch (this.state.PageName) {
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
      }
    });
  };

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const userNameError = isFieldTouched("userName") && getFieldError("userName");
    const passwordError = isFieldTouched("password") && getFieldError("password");
    return (
      <div className="Login">
        <div className="Login-SelectComponent">
          <Select placeholder={"選擇使用者"} style={{ width: 190 }} onChange={this.handlePageSelect}>
            <Option value={"User"}>User</Option>
            <Option value={"Trainer"}>Trainer</Option>
            <Option value={"Expert"}>Expert</Option>
          </Select>
        </div>
        <Form layout="vertical" onSubmit={this.handleLoginSubmit}>
          <FormItem validateStatus={userNameError ? "error" : ""} help={userNameError || ""}>
            {getFieldDecorator("userName", {
              rules: [{ required: true, message: "請輸入你的帳號!" }]
            })(
              <Input prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />} placeholder="帳號" />
            )}
          </FormItem>
          <FormItem validateStatus={passwordError ? "error" : ""} help={passwordError || ""}>
            {getFieldDecorator("password", {
              rules: [{ required: true, message: "請輸入你的密碼!" }]
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
                type="password"
                placeholder="密碼"
              />
            )}
          </FormItem>
          <FormItem>
            <Button htmlType="submit" disabled={hasErrors(getFieldsError())}>
              登入
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(Login);
