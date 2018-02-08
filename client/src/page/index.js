import React, { Component } from "react";
import "./index.css";

//載入 router library
import { Router, Route } from "react-router-dom";
import history from "./RouterHistory";

//載入 Login
import Login from "./Login/index";
//載入 ChatRoom
import ChatRoom from "./Chat/index";
//載入 Keyword Identify page
import KeyWordIdentify from "./KeyWordIdentify/index";
//載入CsCreator page
import CsCreator from "./CsCreator/index";

class Routers extends Component {
  _renderRoute = () => (
    <div className="Index-Content-Page">
      <Route exact path="/" component={Login} />
      <Route path="/Chat" component={ChatRoom} />
      <Route path="/Ki" component={KeyWordIdentify} />
      <Route path="/CsCreator" component={CsCreator} />
    </div>
  );

  render() {
    return (
      <Router history={history}>
        <div className="Index">
          <header className="Index-header">
            <h1 className="Index-title">Keyword Identify</h1>
          </header>
          <div className="Index-Content">{this._renderRoute()}</div>
        </div>
      </Router>
    );
  }
}

export default Routers;
