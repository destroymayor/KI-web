import React, { Component } from "react";
import "./index.css";
import logo from "../utils/logo.svg";

//載入 router library
import { BrowserRouter as Router, Route } from "react-router-dom";

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
      <Router>
        <div className="Index">
          <header className="Index-header">
            <img src={logo} className="Index-logo" alt="logo" />
            <h1 className="Index-title">Keyword Identify For Web</h1>
          </header>
          <div className="Index-Content">
            <div className="Index-Content-Menu">
              <Menu />
            </div>
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
