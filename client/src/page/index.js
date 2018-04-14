// 載入 router library
import { Router, Route } from "react-router-dom";
import Switch from "react-router-dom/Switch";
import history from "./RouterHistory";

import React, { Component } from "react";
import "./index.css";

import RouterManger from "./RouterManager";

class Routers extends Component {
  renderRoute = () => (
    <div className="Index-Content">
      <Switch>
        <Route exact path="/" component={RouterManger.Login} />
        <Route path="/Chat" component={RouterManger.ChatRoom} />
        <Route path="/KeywordIdentify" component={RouterManger.KeyWordIdentify} />
        <Route path="/CsCreator" component={RouterManger.CsCreator} />
        <Route path="/pdf2text" component={RouterManger.Pdf2text} />
        <Route component={() => <RouterManger.Notfound NotfoundText="您訪問的頁面不存在" />} />
      </Switch>
    </div>
  );

  render() {
    return (
      <Router history={history}>
        <div className="Index">
          <header className="Index-header">
            <h1 className="Index-title">Keyword Identify</h1>
          </header>
          {this.renderRoute()}
        </div>
      </Router>
    );
  }
}

export default Routers;
