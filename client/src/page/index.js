import React, { Component } from "react";

import { BrowserRouter as Router, Route } from "react-router-dom";
import KI from "./KI/index";

class App extends Component {
  render() {
    return (
      <Router>
        <Route exact path="/" component={KI} />
      </Router>
    );
  }
}

export default App;
