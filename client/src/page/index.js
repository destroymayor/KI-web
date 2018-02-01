import React, { Component } from "react";
import "./index.css";
import logo from "../utils/logo.svg";

//載入 router library
import { BrowserRouter as Router, Route } from "react-router-dom";

//載入 Keyword Identify component
import Ki from "./KI/index";
//載入 CsCreator component
import CsCreator from "./CsCreator/index";
//載入 Menu component
import Menu from "../utils/Menu/index";

class Routers extends Component {
  render() {
    return (
      <Router>
        <div className="Index">
          <header className="Index-header">
            <img src={logo} className="Index-logo" alt="logo" />
            <h1 className="Index-title">Kw Identify for Web</h1>
          </header>
          <div className="Index-Content">
            <div className="Index-Content-Menu">
              <Menu />
            </div>
            <div className="Index-Content-Page">
              <Route exact path="/Ki" component={Ki} />
              <Route path="/CsCreator" component={CsCreator} />
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default Routers;
