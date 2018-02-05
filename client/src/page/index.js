import React, { Component } from "react";
import "./index.css";

//載入 router library
import { Router, Route } from "react-router-dom";
import history from "./RouterHistory";

//載入 ChatRoom
import ChatRoom from "./Chat/index";
//載入 Keyword Identify page
import Ki from "./KI/index";
//載入CsCreator page
import CsCreator from "./CsCreator/index";
//載入選單組件
import Menu from "../utils/Menu/index";

class Routers extends Component {
  render() {
    return (
      <Router history={history}>
        <div className="Index">
          <header className="Index-header">
            <h1 className="Index-title">Keyword Identify</h1>
          </header>
          <div className="Index-Content">
            <Menu />
            <div className="Index-Content-Page">
              <Route exact path="/" component={ChatRoom} />
              <Route path="/Ki" component={Ki} />
              <Route path="/CsCreator" component={CsCreator} />
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default Routers;
